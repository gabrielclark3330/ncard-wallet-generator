import JsBarcode from "jsbarcode";

function NCard(props) {
    JsBarcode("#barcode", "1234567890128", {format: "ean13"});
}

export default NCard;