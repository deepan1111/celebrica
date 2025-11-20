import Slider from "../components/Slider";
import Categories from "./Categories";
import Services from "./Services";
import Contact from "./Contact";


export default function Home() {
    return(
       <>
        <div className="mb-8 p-10"><Slider/></div>
        <Categories />
       
        <Services />
        
        <Contact />
       </> 
    );
}