import { QnAChatInterface } from "@/components/qna-chat-interface"

export default function QnAPage() {
    return (
        <main
            className="flex flex-col items-center justify-start w-full px-0 sm:px-4 lg:px-8 mt-16 sm:mt-20 h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)]"
            aria-label="Bits and Bytes QnA Assistant"
        >
            <div className="w-full max-w-4xl h-full sm:py-6 pb-2 sm:pb-4">
                <QnAChatInterface />
            </div>
        </main>
    )
}
