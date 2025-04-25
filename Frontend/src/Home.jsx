import {Terminal,Rocket,Globe,Share2,Cpu,MonitorPlay,Code} from "lucide-react"
import {Link} from "react-router-dom"

function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col  bg-gradient-to-b from-gray-800  to-gray-950">
        <div className="text-white h-[15vh] flex justify-between items-center px-10">
            <span className="text-3xl font-extrabold flex gap-2 items-center"><Code size={30}/> Code Bit</span>
            <div className="flex gap-3 items-center">
                <span>Sign up</span>
                <span className="flex gap-1 px-4 py-2 border-1 border-gray-500 text-white text-sm rounded-lg cursor-pointer duration-100 hover:border-blue-600">Get Started</span>
            </div>
        </div>
        <div className="flex flex-col h-[85vh] py-10 justify-center items-center gap-5">
            <h1 className="text-white text-5xl font-bold text-center">Code Smarter, Build Faster</h1>
            <p className="text-gray-500 text-lg text-center max-w-xl ">A powerful, cloud-based code editor designed for modern development workflows. Write, collaborate, and Real-time Collaboration.</p>
            <div className="flex gap-3">
              <Link to="/code/workplace"><span className="flex gap-1 px-4 py-3 bg-blue-500 text-white text-sm rounded-lg cursor-pointer duration-100 hover:bg-blue-600"><Terminal size={20}/> Start Coding Now</span></Link>
              <Link to="/code/workplace/stroage"><span className="flex gap-1 px-4 py-3 bg-gray-700 text-white text-sm rounded-lg cursor-pointer duration-100 hover:bg-gray-800"><Rocket size={20}/> Create Workspace</span></Link>
            </div>
        </div>
        <div className="min-h-screen h-max flex flex-col items-center  justify-around ">
            <h1 className="text-3xl text-white font-bold">⚡ Powerful Features</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
              <Container icon={Globe} title={"Multi-Language Support"} description={"Write and compile code in C++, Java, Python, and many more languages with intelligent syntax highlighting."}/>
              <Container icon={Share2} title={"Real-time Collaboration"} description={"Code together with your team in real-time. Share your workspace and collaborate efficiently."}/>
              <Container icon={Cpu} title={"Powerful Compiler"} description={"Built-in compiler support for multiple languages with detailed error reporting and debugging."}/>
              <Container icon={MonitorPlay} title={"Live Preview"} description={"See your changes in real-time with our integrated preview window for web development."}/>
              <Container icon={Terminal} title={"Integrated Terminal"} description={"Full-featured terminal with support for custom commands and multiple instances."}/>
              <Container icon={Rocket} title={"CodeBase Integration"} description={"Seamlessly integrate with your code base. Clone, commit, and manage your projects directly from the editor."}/>
            </div>
        </div>
    </div>
  )
}

function Container({icon:Icon,title,description}){
  return(
    <div className="bg-gray-800 flex flex-col gap-3  text-white p-5 rounded-2xl hover:outline-1 hover:outline-blue-600">
      {Icon?<Icon className="text-indigo-500" size={30} />:null}
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-gray-500 text-lg">{description}</p>
    </div>
  )
}

export default Home