import { useState } from "react";

export default function Fetcher2() {
  const [apiUrl, setApiUrl] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);

    const suggstionURL=['https://jsonplaceholder.typicode.com/posts','https://jsonplaceholder.typicode.com/comments','https://jsonplaceholder.typicode.com/albums','https://jsonplaceholder.typicode.com/photos','https://jsonplaceholder.typicode.com/todos','https://jsonplaceholder.typicode.com/users']

  const handleInputChange = (e) => {
    setApiUrl(e.target.value);
  };

  
  const handelRandom=()=>{
  const random=  Math.floor((Math.random()*6) + 0);
setApiUrl(suggstionURL[random])

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Loading...");

    try {
      const response = await fetch(apiUrl);
      const json = await response.json();

      if (Array.isArray(json)) {
        setData(json);
      } else {
        setData([json]);
      }

      setStatus("");
    } catch (error) {
      setStatus("An error occurred.");
    }
  };

  const isObject = (val) => {
    return typeof val === "object" && !Array.isArray(val) && val !== null;
  };

  const flattenObject = (ob) => {
    const toReturn = {};

    for (const i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if (isObject(ob[i])) {
        const flatObject = flattenObject(ob[i]);
        for (const x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + "." + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  };

  const prepareDataForTable = (data) => {
    const flattenedData = data.map((item) => flattenObject(item));
    const headers = Object.keys(flattenedData[0]);

    return {
      headers: headers,
      rows: flattenedData.map((item) => headers.map((header) => item[header])),
    };
  };

  const tableData = data ? prepareDataForTable(data) : null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block font-medium text-gray-700 mb-2" htmlFor="input">
          API URL
        </label>
        <input
          className="border border-gray-400 p-2 w-full"
          type="text"
          id="input"
          name="input"
          value={apiUrl}
          onChange={handleInputChange}
        />
        <button className="bg-blue-500 text-white py-2 px-4 mt-4" type="submit">
          Submit
        </button>
      </form>
       <button onClick={handelRandom} className="ml-10 bg-blue-500 text-white py-2 px-4 mt-4" >
            Try a random api end point
        </button>
      {status && <p className="text-gray-700">{status}</p>}
      {tableData && (
        <table className="table-auto w-full">
          <thead>
            <tr>
              {tableData.headers.map((header, index) => (
                <th key={index} className="px-4 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, index) => (
                  <td key={index} className="border px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
