export default function Home() {
  return (
    <ul>
      {Array.from({ length: 1000 }).map((item, index) => {
        return <li key={index}>Home{index}</li>
      })}
    </ul>
  )
}
