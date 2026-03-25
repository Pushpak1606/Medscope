import { PhoneCall } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const EmergencyFAB = () => {
    const navigate = useNavigate()
    return (
        <button 
           onClick={() => navigate('/patient/emergency')}
           className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-50 h-[3.5rem] w-[3.5rem] rounded-full bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group"
        >
            {/* Ambient radar pulse effect behind the icon */}
            <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-50"></div>
            <PhoneCall className="h-6 w-6 relative z-10 group-hover:animate-none" />
        </button>
    )
}
