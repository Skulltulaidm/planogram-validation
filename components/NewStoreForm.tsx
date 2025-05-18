// app/tiendas/NewStoreForm.tsx
"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import type { Database } from "@/lib/supabase/database.types"

// Tipo para los supervisores
type Supervisor = Database['public']['Tables']['profiles']['Row']

// Schema de validación para el formulario
const storeSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
    city: z.string().min(2, { message: "La ciudad es requerida" }),
    region: z.string().min(2, { message: "La región es requerida" }),
    manager_id: z.string().optional(),
    status: z.enum(["active", "inactive", "maintenance"]),
})

type StoreFormValues = z.infer<typeof storeSchema>

export default function NewStoreForm({ onSuccess }: { onSuccess: () => void }) {
    const [supervisors, setSupervisors] = useState<Supervisor[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Cargar supervisores para el selector
    useEffect(() => {
        async function loadSupervisors() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'supervisor')

            if (error) {
                console.error('Error al cargar supervisores:', error)
            } else {
                setSupervisors(data || [])
            }
        }

        loadSupervisors()
    }, [])

    // Configurar el formulario
    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: "",
            address: "",
            city: "",
            region: "",
            status: "active",
        },
    })

    // Enviar el formulario
    async function onSubmit(values: StoreFormValues) {
        setIsSubmitting(true)

        // Agregar un valor de cumplimiento predeterminado
        const storeData = {
            ...values,
            compliance: 100, // Valor inicial para tiendas nuevas
        }

        const supabase = createClient()
        const { data, error } = await supabase
            .from('stores')
            .insert([storeData])
            .select()

        setIsSubmitting(false)

        if (error) {
            console.error('Error al crear tienda:', error)
            form.setError("root", {
                message: "Hubo un error al crear la tienda. Intente nuevamente."
            })
        } else {
            form.reset()
            onSuccess()
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de la Tienda</FormLabel>
                            <FormControl>
                                <Input placeholder="Oxxo Centro" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Input placeholder="Av. Revolución 123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ciudad de México" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Región</FormLabel>
                                <FormControl>
                                    <Input placeholder="Centro" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="manager_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gerente</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar Gerente" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="">Sin asignar</SelectItem>
                                        {supervisors.map((supervisor) => (
                                            <SelectItem key={supervisor.id} value={supervisor.id}>
                                                {supervisor.first_name} {supervisor.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar Estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Activa</SelectItem>
                                        <SelectItem value="inactive">Inactiva</SelectItem>
                                        <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {form.formState.errors.root && (
                    <p className="text-sm font-medium text-red-500">
                        {form.formState.errors.root.message}
                    </p>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full bg-oxxo-red hover:bg-oxxo-red/90">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear Tienda
                </Button>
            </form>
        </Form>
    )
}