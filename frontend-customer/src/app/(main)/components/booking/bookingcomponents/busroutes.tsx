import { Search } from "lucide-react"
import { Bus, Train } from "lucide-react"
import { Input } from "@/components/ui/input"
import type React from "react" // Import React

export default function BusRoutes() {
    return (
        <div className="flex flex-col h-screen">
            {/* Search Header */}
            <div className="flex items-center gap-4 p-4 border-b">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input className="pl-9" placeholder="Tìm địa điểm..." type="search" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">

                        <span className="text-sm font-medium">Địa điểm xung quanh</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Routes List */}
                <div className="w-80 border-r overflow-y-auto">
                    <div className="space-y-1 p-2">
                        <RouteItem
                            icon={<Train className="h-5 w-5" />}
                            number="Metro 1"
                            from="Bến Thành"
                            to="Suối Tiên"
                            time="05:00 - 22:00"
                            price="20.000 VND"
                            color="text-emerald-600"
                        />
                        <RouteItem
                            icon={<Bus className="h-5 w-5" />}
                            number="D4"
                            from="Vinhomes Grand Park"
                            to="Bến xe buýt Sài Gòn"
                            time="05:00 - 22:00"
                            price="7.000 VND"
                            color="text-emerald-600"
                        />
                        <RouteItem
                            icon={<Bus className="h-5 w-5" />}
                            number="01"
                            from="Bến Thành"
                            to="Bến Xe buýt Chợ Lớn"
                            time="05:00 - 20:15"
                            price="5.000 VND"
                            color="text-emerald-600"
                        />
                        <RouteItem
                            icon={<Bus className="h-5 w-5" />}
                            number="03"
                            from="Bến Thành"
                            to="Thanh Xuân"
                            time="04:00 - 20:45"
                            price="6.000 VND"
                            color="text-emerald-600"
                        />
                    </div>
                </div>

                {/* Empty Space for Map */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center">
                    <span className="text-muted-foreground">Khu vực bản đồ (Bạn có thể thêm map tại đây)</span>
                </div>
            </div>
        </div>
    )
}

interface RouteItemProps {
    icon: React.ReactNode
    number: string
    from: string
    to: string
    time: string
    price: string
    color: string
}

function RouteItem({ icon, number, from, to, time, price, color }: RouteItemProps) {
    return (
        <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer">
            <div className={`mt-1 ${color}`}>{icon}</div>
            <div className="flex-1 space-y-1">
                <div className="font-medium">Tuyến số {number}</div>
                <div className="text-sm text-muted-foreground">
                    {from} - {to}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span>{time}</span>
                    </div>
                    <div>{price}</div>
                </div>
            </div>
        </div>
    )
}
