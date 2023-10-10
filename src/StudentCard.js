import { useEffect, useState, useRef } from "react";
import JsBarcode from "jsbarcode";
//import { DOMImplementation, XMLSerializer } from "xmldom";

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
      return (
        studentJson.unlSISMajor + " in " + studentJson.unlHRPrimaryDepartment
      );
    }
    return studentJson.unlSISMajor;
  } else if (studentJson.title !== null) {
    if (studentJson.unlHRPrimaryDepartment !== null) {
      return studentJson.title + " in " + studentJson.unlHRPrimaryDepartment;
    }
    return studentJson.title;
  } else {
    return "Unl Associate";
  }
}
function BarcodeGenerator({ value }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "ean13", // Use the appropriate format if "mean13" is different
        displayValue: true, // displays the provided value below the barcode
        width: 3,
        height: 100,
      });
    }
  }, [value]);

  return <svg ref={barcodeRef}></svg>;
}

function StudentCard(props) {
  const [studentJson, setStudentJson] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);
  const [cardIteration, setCardIteration] = useState(1);
  useEffect(() => {
    GetStudentDetails(props.studentURL, setStudentJson);
  }, [props.studentURL]);

  return (
    <div className="rounded-lg my-6 mx-4 shadow-lg border border-gray">
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray">
            <h2 className="text-xl mb-4">NCard Barcode iteration {cardIteration} 😈</h2>
            <BarcodeGenerator value={studentJson.unluncwid + cardIteration.toString().padStart(4, 0)} />
            <div>
              <button
                onClick={() => {setShowOverlay(false); setCardIteration(1)}}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 mx-2 rounded"
              >
                Close
              </button>
              <button
                onClick={() => setCardIteration(cardIteration+1)}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 mx-2 rounded"
              >
                +1
              </button>
              <button
                onClick={() => {cardIteration>1? setCardIteration(cardIteration-1):setCardIteration(1)}}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 mx-2 rounded"
              >
                -1
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="py-2 mx-2">
        {studentJson ? studentJson.displayName : props.studentName}
      </div>
      <div className="py-2 mx-2">{Title(studentJson)}</div>
      <div className="py-2 mx-2">
        {studentJson ? "NUID: " + studentJson.unluncwid : "loading"}
      </div>
      <button
        onClick={() => {
          setShowOverlay(true);
        }}
        className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 my-2 mx-2 rounded shadow-lg"
      >
        NCard Barcode
      </button>
    </div>
  );
}
//, {format: "ean13"}
export default StudentCard;
