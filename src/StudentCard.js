import { useEffect, useState } from "react";
import NCard from "./NCard";
import JsBarcode from "jsbarcode";

async function GetStudentDetails(studentURL, setStudentJson) {
    if (studentURL.includes("department")) {
        return;
    }
  const response = await fetch(studentURL + encodeURIComponent(".json"));
  const studentJson = await response.json();
  setStudentJson(studentJson);
  //console.log(studentJson);
}

function Title(studentJson) {
    if (studentJson.unlSISMajor !== null) {
        if (studentJson.unlHRPrimaryDepartment !== null) {
            return studentJson.unlSISMajor + " in " + studentJson.unlHRPrimaryDepartment;
        }
        return studentJson.unlSISMajor;
    }else if (studentJson.title !== null){
        if (studentJson.unlHRPrimaryDepartment !== null) {
            return studentJson.title + " in " + studentJson.unlHRPrimaryDepartment;
        }
        return studentJson.title;
    } else {
        return "Unl Associate";
    }
}

function StudentCard(props) {
  const [studentJson, setStudentJson] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    GetStudentDetails(props.studentURL, setStudentJson);
  }, [props.studentURL]);
  return (
    <div className="rounded-lg my-6 mx-4 shadow-lg border border-gray">
        {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Overlay content here!</h2>
            <svg id="barcode"></svg>
            <button
              onClick={() => setShowOverlay(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="py-2 mx-2">
        {studentJson ? studentJson.displayName : props.studentName}
      </div>
      <div className="py-2 mx-2">
        {Title(studentJson)}
      </div>
      <div className="py-2 mx-2">
        {studentJson ? "NUID: "+studentJson.unluncwid : "loading"}
      </div>
      <button onClick={() => {setShowOverlay(true); JsBarcode("#barcode", "1234567890128", {format: "ean13"});}} className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 my-2 mx-2 rounded shadow-lg">NCard</button>
    </div>
  );
}

export default StudentCard;
