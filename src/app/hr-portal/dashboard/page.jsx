import AddCollegeNameForm from "@/components/AddCollgeNamesForm";
import CollegesNamesList from "@/components/CollegeNamesList";

function AdminDashboard(){
return <>
<div className="flex ">
<AddCollegeNameForm/>
<CollegesNamesList/>
</div>
</>

}
export default AdminDashboard;