import { useState, useEffect } from 'react'
import axios from 'axios';

const Home = () => {
  const [testData, setTestData] = useState({
    name: "",
    email: ""
  });
  useEffect(() => {
    axios.get("http://localhost:5000/api/data")
      .then((res: any) => { setTestData(res.data) })
      .catch((err: any) => { console.log(err) });
  }, [])
  return (
    <>
      <h1>Hello world</h1>
      <p>{testData.name}</p>
      <p>{testData.email}</p>
    </>
  )
}

export default Home