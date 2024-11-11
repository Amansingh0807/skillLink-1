import { UploadButton } from "../utils/uploadThing";

export default function UploadPfp() {
    return (
        <>
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {

                    console.log("Files: ", res.url);
                    alert("Upload Completed");
                }}
                onUploadError={(error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </>
    )
}
