import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Datos de ejemplo
const inventoryData = [
  {
    id: "prod-1",
    storeId: "store-1",
    name: "Agua Mineral 1L",
    sku: "BEB001",
    category: "Bebidas",
    stock: 24,
    minStock: 10,
    status: "ok",
    lastUpdated: "Hoy, 10:45",
  },
  {
    id: "prod-2",
    storeId: "store-1",
    name: "Refresco Cola 2L",
    sku: "BEB015",
    category: "Bebidas",
    stock: 8,
    minStock: 15,
    status: "low",
    lastUpdated: "Hoy, 09:30",
  },
  {
    id: "prod-3",
    storeId: "store-3",
    name: "Detergente Líquido",
    sku: "LIM023",
    category: "Limpieza",
    stock: 0,
    minStock: 5,
    status: "out",
    lastUpdated: "Ayer, 18:15",
  },
  {
    id: "prod-4",
    storeId: "store-2",
    name: "Galletas Chocolate",
    sku: "SNK045",
    category: "Snacks",
    stock: 32,
    minStock: 20,
    status: "ok",
    lastUpdated: "Hoy, 11:20",
  },
  {
    id: "prod-5",
    storeId: "store-3",
    name: "Papel Higiénico",
    sku: "HIG012",
    category: "Higiene",
    stock: 3,
    minStock: 10,
    status: "low",
    lastUpdated: "Ayer, 14:30",
  },
]

interface InventoryStatusProps {
  selectedStore: string | null
}

export default function InventoryStatus({ selectedStore }: InventoryStatusProps) {
  const filteredInventory = selectedStore
    ? inventoryData.filter((item) => item.storeId === selectedStore)
    : inventoryData

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return <Badge className="bg-green-500">En stock</Badge>
      case "low":
        return <Badge className="bg-yellow-500">Bajo</Badge>
      case "out":
        return <Badge className="bg-red-500">Agotado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Estado de Inventario</h3>
        {selectedStore && (
          <Badge variant="outline" className="ml-2">
            Filtrando por tienda
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Inventario de Productos</CardTitle>
              <CardDescription>Productos con problemas de stock que afectan planogramas</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar productos..." className="pl-8 w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">
                    {item.stock} / {item.minStock}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      Solicitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productos Agotados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredInventory.filter((item) => item.status === "out").length}</div>
            <p className="text-xs text-muted-foreground">Requieren reposición inmediata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productos Bajo Mínimo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredInventory.filter((item) => item.status === "low").length}</div>
            <p className="text-xs text-muted-foreground">Requieren reposición pronto</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productos en Buen Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredInventory.filter((item) => item.status === "ok").length}</div>
            <p className="text-xs text-muted-foreground">No requieren acción inmediata</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
