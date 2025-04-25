import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import "codemirror/theme/dracula.css";
import "codemirror/theme/material.css"
import "codemirror/theme/monokai.css"
import "codemirror/theme/twilight.css"
import "codemirror/theme/eclipse.css"
import "codemirror/theme/3024-day.css"
import "codemirror/theme/neat.css"
import "codemirror/theme/xq-light.css"
import "codemirror/theme/gruvbox-dark.css"
import "codemirror/theme/oceanic-next.css"

import { useState } from "react";

function Theme({editor}) {
    let [theme,Settheme]=useState("dracula");
    function handleChange(event){
        theme=event.target.value;
        editor.setOption("theme",theme)
        Settheme(theme);
    }
  return (
    <FormControl className="w-35">
      <InputLabel id="demo-simple-select-label" sx={{color:"darkgray"}}>Theme</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={theme}
        label="Language"
        onChange={handleChange}
        className="h-9"
        sx={{color:"darkgray",backgroundColor:"#374151"}}
      >
        <MenuItem value={"dracula"}>Dracula</MenuItem>
        <MenuItem value={"neat"}>Neat</MenuItem>
        <MenuItem value={"material"}>Material</MenuItem>
        <MenuItem value={"xq-light"}>XQ Light</MenuItem>
        <MenuItem value={"monokai"}>Monokai</MenuItem>
        <MenuItem value={"eclipse"}>Eclipse</MenuItem>
        <MenuItem value={"twilight"}>Twilight</MenuItem>
        <MenuItem value={"3024-day"}>Solarized Light</MenuItem>
        <MenuItem value={"gruvbox-dark"}>Gruvbox Dark</MenuItem>
        <MenuItem value={"oceanic-next"}>Oceanic Next</MenuItem>
      </Select>
    </FormControl>
  );
}

export default Theme;
