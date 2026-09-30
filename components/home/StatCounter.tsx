
interface StatCounterProps {
    value: string;
    label: string;
}

export default function StatCounter({ value, label }: StatCounterProps) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-white">{value}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/70">{label}</span>
        </div>
    );
}
