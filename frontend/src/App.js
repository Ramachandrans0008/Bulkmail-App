import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
// import { baseurl } from "./urls";

function App() {
  const [mess, setmess] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setemailList] = useState([]);
  const handlemess = (evt) => {
    setmess(evt.target.value);
  };
  function send() {
    setstatus(true);
    axios
      .post(`http://localhost:5001/sendmail`, {
        mess: mess,
        emailList: emailList,
      })
      .then(function (data) {
        if (data.data === true) {
          alert("Mail send sucessfully");
          setstatus(false);
        } else {
          alert("Failed to send mail");
        }
      });
  }
  function handlefile(event) {
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map(function (item) {
        return item.A;
      });
      console.log(totalemail);
      setemailList(totalemail);
    };

    reader.readAsBinaryString(file);
  }
  return (
    <div>
      <div className="bg-teal-950 text-center text-4xl font-bold text-white p-5">
        Bulk Mail
      </div>
      <div className="bg-teal-800 text-center text-2xl font-medium text-white p-2">
        We can help your business with sending multiple emails at once
      </div>
      <div className="bg-teal-600 text-center text-2xl font-medium text-white p-2">
        Drag and Drop
      </div>
      <div className="bg-teal-300 text-center text-black p-2">
        <textarea
          onChange={handlemess}
          value={mess}
          className="w-[80%] h-32 py-2 px-2 outline-none rounded-md mt-3 "
          placeholder="Enter your emails here......"
        ></textarea>
        <div>
          <input
            onChange={handlefile}
            type="file"
            className="border-4 border-dashed px-4 py-4 mt-4 mb-5"
          />
        </div>
        <p>Total Emails in the file : {emailList.length}</p>
        <button
          className="bg-cyan-600 mt-2 mb-2 border rounded-md p-2"
          onClick={send}
        >
          {status ? "sending...." : "send"}
        </button>
      </div>
      <div className="bg-teal-800 text-center text-2xl font-medium text-white p-10"></div>
      <div className="bg-teal-600 text-center text-2xl font-medium text-white p-10"></div>
    </div>
  );
}

export default App;
