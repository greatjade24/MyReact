/* eslint-disable @typescript-eslint/no-explicit-any */
const Alert = ({ onAlert }: { onAlert: any }) => {
    // const handleClick = () => alert('Hello')

    return <button onClick={onAlert}>Click</button>
}

export default Alert