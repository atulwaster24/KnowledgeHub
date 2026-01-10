export default function NotificationToast ({message}) {
    return (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow">
            {message}
        </div>
    )
}