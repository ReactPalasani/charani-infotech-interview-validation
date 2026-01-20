import { ChevronRight, Copyright } from "lucide-react";

function Footer(){
    return(
        <div className="grid bg-gray-500 p-4 text-white flex-3 w-full">
            <div className="flex">
            <div className="grid w-1/3">
                <h1 className="font-bold text-2xl">ABOUT Charani Infotech Pvt Ltd</h1>
                <p>Charani Infotech Pvt Ltd is a Hyderabad-based company specializing in Full Stack Development, Python, Dotnet, Testing, AI solutions, and Recruitment.</p>
            </div>
            <div className="grid ml-auto">
               <h1 className="font-bold text-2xl">Useful Links</h1>
                <a className="text-gray-900 underline" href="https://www.charani.in/">https://www.charani.in/</a>
            </div>
            <div className="grid ml-auto">
                <h1 className="font-bold text-2xl">OUR SERVICES</h1>
                 <ul>
                    <li className="flex"> <ChevronRight />Web applications</li>
                    <li className="flex"> <ChevronRight />Mobile applications</li>
                    <li className="flex"> <ChevronRight />Customer support</li>
                    <li className="flex"> <ChevronRight />Training and placements</li>
                    <li className="flex"> <ChevronRight />Recruitment solutions</li>
                 </ul>
            </div>
            </div>
            <div className="flex p-2 gap-2">
            <Copyright /> Copyright 2025 Charani Infotech Pvt Ltd. All Rights Reserved.
            </div>
        </div>
    )
}
export default Footer;