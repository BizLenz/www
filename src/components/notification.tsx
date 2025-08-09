import type {ReactNode} from "react";

interface NotificationProps {
    icon: ReactNode;
    title: string;
    body: string;
}

export default function Notification({icon, title, body}: NotificationProps) {
    return (
        <div className="flex flex-1 flex-row items-center gap-4 rounded-xl border-1 p-5">
            {icon}
            <div>
                <div className="text-lg font-semibold">{title}</div>
                <small className="text-sm leading-none font-medium"> {body}</small>
            </div>
        </div>
    );
}
