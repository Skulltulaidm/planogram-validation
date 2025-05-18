// app/api/reports/generate/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

export async function POST(request: Request) {
    try {
        const { templateId, format, parameters } = await request.json()

        // Obtener la plantilla de reporte
        const { data: template, error: templateError } = await supabaseAdmin
            .from('report_templates')
            .select('*')
            .eq('id', templateId)
            .single()

        if (templateError || !template) {
            return NextResponse.json(
                { error: 'Plantilla no encontrada' },
                { status: 404 }
            )
        }

        // Obtener datos para el reporte (ejemplo: planogramas y cumplimiento)
        const { data: planograms, error: planogramError } = await supabaseAdmin
            .from('planograms')
            .select('*')

        if (planogramError) {
            return NextResponse.json(
                { error: 'Error al obtener datos de planogramas' },
                { status: 500 }
            )
        }

        // Obtener datos de tiendas-planogramas para calcular cumplimiento
        const { data: storePlanograms, error: storeError } = await supabaseAdmin
            .from('store_planograms')
            .select('*')

        if (storeError) {
            return NextResponse.json(
                { error: 'Error al obtener datos de cumplimiento' },
                { status: 500 }
            )
        }

        // Procesar los datos para el reporte
        const reportData = planograms.map(planogram => {
            // Filtrar las relaciones para este planograma
            const relatedStorePlanograms = storePlanograms.filter(
                sp => sp.planogram_id === planogram.id
            )

            // Calcular el cumplimiento promedio
            const storeCount = relatedStorePlanograms.length
            const compliance = storeCount > 0
                ? Math.round(
                    relatedStorePlanograms.reduce((acc, sp) => acc + sp.compliance, 0) / storeCount
                )
                : 0

            return {
                id: planogram.id,
                name: planogram.name,
                category: planogram.category,
                department: planogram.department,
                status: planogram.status,
                storeCount,
                compliance
            }
        })

        // Generar el reporte según el formato
        let reportBlob, reportSize, reportFileName

        if (format === 'pdf') {
            // Crear PDF
            const doc = new jsPDF()
            doc.setFontSize(22)
            doc.text(template.name, 20, 20)

            doc.setFontSize(12)
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30)

            // Añadir tabla de datos
            doc.setFontSize(10)
            let yPos = 50

            // Encabezados
            doc.text('Nombre', 20, yPos)
            doc.text('Categoría', 80, yPos)
            doc.text('Cumplimiento', 130, yPos)
            doc.text('Tiendas', 170, yPos)

            yPos += 10

            // Datos
            reportData.forEach((item, index) => {
                if (yPos > 270) {
                    doc.addPage()
                    yPos = 20
                }

                doc.text(item.name.substring(0, 30), 20, yPos)
                doc.text(item.category, 80, yPos)
                doc.text(`${item.compliance}%`, 130, yPos)
                doc.text(item.storeCount.toString(), 170, yPos)

                yPos += 7
            })

            // Convertir a Blob
            const pdfBlob = doc.output('blob')
            reportBlob = pdfBlob
            reportSize = `${Math.round(pdfBlob.size / 1024 * 10) / 10} KB`
            reportFileName = `${template.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
        } else if (format === 'excel') {
            // Crear Excel
            const worksheet = XLSX.utils.json_to_sheet(reportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos')

            // Convertir a Blob
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
            const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            reportBlob = excelBlob
            reportSize = `${Math.round(excelBlob.size / 1024 * 10) / 10} KB`
            reportFileName = `${template.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
        } else {
            return NextResponse.json(
                { error: 'Formato no soportado' },
                { status: 400 }
            )
        }

        // Subir el archivo al bucket de Storage
        const { data: upload, error: uploadError } = await supabaseAdmin
            .storage
            .from('reports')
            .upload(
                `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${reportFileName}`,
                reportBlob,
                { contentType: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
            )

        if (uploadError) {
            return NextResponse.json(
                { error: 'Error al guardar el reporte' },
                { status: 500 }
            )
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('reports')
            .getPublicUrl(`${new Date().getFullYear()}/${new Date().getMonth() + 1}/${reportFileName}`)

        // Registrar el reporte en la base de datos
        const { data: report, error: reportError } = await supabaseAdmin
            .from('reports')
            .insert({
                name: template.name,
                type: template.type,
                frequency: parameters?.frequency || 'one-time',
                last_generated: new Date().toISOString(),
                format: format,
                status: 'completed',
                size: reportSize
            })
            .select()
            .single()

        if (reportError) {
            return NextResponse.json(
                { error: 'Error al registrar el reporte en la base de datos' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            report: {
                id: report.id,
                name: report.name,
                url: publicUrl,
                size: reportSize,
                format: format
            }
        })

    } catch (error) {
        console.error('Error al generar reporte:', error)
        return NextResponse.json(
            { error: 'Error al generar el reporte' },
            { status: 500 }
        )
    }
}