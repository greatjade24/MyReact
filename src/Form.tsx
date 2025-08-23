/* eslint-disable @typescript-eslint/no-explicit-any */
const Form = () => {
  const handleSubmit = (event: any) => {
    const text = event.target.elements.user.value
    // 브라우저 기본 동작 제어
    event.preventDefault()

    alert(text)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="user" />
      <button>Submit</button>
    </form>
  )
}

export default Form
