import AddCollegeNameForm from "@/components/AddCollgeNamesForm";
import CollegesNamesList from "@/components/CollegeNamesList";

function AdminDashboard(){
return <>
<div className="flex max-w-full ">
    <div className="w-1/2">
<AddCollegeNameForm/>
</div>
<div className="w-1/2">
<CollegesNamesList/>
</div>
</div>
</>

}
export default AdminDashboard;