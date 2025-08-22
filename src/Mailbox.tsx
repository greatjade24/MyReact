// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Mailbox = ({ unreadMessage }: { unreadMessage: any }) => {
    return (
        <div>
            <h1>Hello</h1>
            {unreadMessage.length > 0 && (
                <p>{unreadMessage.length}개를 읽지 않았습니다.</p>
            )}
        </div>
    )
}

export default Mailbox