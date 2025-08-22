export default function Message({content, sender}) {
    if (sender === "user") {
        return (
            <div className="flex flex-col items-end w-full">
                <p className="text-sm bg-blue-500 text-white rounded-lg p-4">{content}</p>
            </div>
        )
    }
    else if (sender === "ai") {
        return (
            <div className="flex flex-col items-start w-full">
                <p className="text-sm bg-neutral-800 text-white rounded-lg p-4">{content}</p>
            </div>
        )
    }
    else {
        return (
            <div className="flex flex-col items-start w-full">
                <h1 className="text-lg font-bold">{sender}</h1>
                <p className="text-sm bg-neutral-800 text-white rounded-lg p-4">{content}</p>
            </div>
        )
    }
}