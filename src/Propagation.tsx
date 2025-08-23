/* eslint-disable @typescript-eslint/no-explicit-any */
const Propagation = () => {
  const handleParent = () => alert("parent")
  const handleChild = (e: any) => {
    // 이벤트 상위 전파 제어
    e.stopPropagation()
    alert("child")
  }

  return (
    <div onClick={handleParent}>
      <button onClick={handleChild}>child</button>
    </div>
  )
}

export default Propagation
