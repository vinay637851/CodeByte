import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useState } from "react";

function Language({editor,SetLang,Lang}) {
  let [language, Setlanguage] = useState(Lang==""?"C++":Lang);
  console.log(Lang)
  const handleChange = (event) => {
    document.getElementById("Input").value = ""; 
    language = event.target.value;
    SetLang(language)
    if (language == "Java") {
      editor.setOption("mode", "text/x-java");
      editor.setValue(
        `// This is a simple Java program\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");  // Output "Hello, Java!" to the console\n  }\n}`
      );
    } else if (language == "Python") {
      editor.setOption("mode", "text/x-python");
      editor.setValue(
        `# This is a Python program\ndef main():\n  print("Hello, Python!")  # Output "Hello, Python!" to the console\n\nif __name__ == "__main__":\n  main()  # Call the main function`
      );
    } else {
      editor.setOption("mode", "text/x-c++src");
      editor.setValue(
        `//This is a C++ program\n#include <iostream>  // Include the input/output stream library \nusing namespace std;\n\nint main() { \n  cout << "Hello, C++!" << endl;  // Output "Hello, C++!" to the console \n  return 0;  // Return 0 to indicate the program ended successfully \n}`
      );
    }
    Setlanguage(language);
  };
  return (
    <FormControl className="w-35" >
      <InputLabel id="demo-simple-select-label" sx={{color:"darkgray"}}>Language</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={language}
        label="Language"
        onChange={handleChange}
        className="h-9"
        sx={{color:"darkgray",backgroundColor:"#374151"}}
      >
        <MenuItem value={"C++"} >C++</MenuItem>
        <MenuItem value={"Java"}>Java</MenuItem>
        <MenuItem value={"Python"}>Python</MenuItem>
      </Select>
    </FormControl>
  );
}

export default Language;
