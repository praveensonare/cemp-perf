import React from 'react'
import ProjectSite_Layout from '../../components/ProjectSite_Layout'
import Card from "react-bootstrap/Card";
import Img1 from '../../assets/images/RoleManagerImages/Img1.png'
import Img2 from '../../assets/images/RoleManagerImages/Img2.png'
import Img3 from '../../assets/images/RoleManagerImages/Img3.png'
import Img4 from '../../assets/images/RoleManagerImages/Img4.png'
import Img5 from '../../assets/images/RoleManagerImages/Img5.png'
import Img6 from '../../assets/images/RoleManagerImages/Img6.png'



function GuidedTourRoleManager() {
    return (
        <ProjectSite_Layout>
            <Card
                style={{
                    width: "100%",
                    border: "none",
                    display: "flex",
                    justifyContent: "centre",
                    marginTop: '-16px'
                }}>
                <Card.Body>
                    <>
                        <div style={{ padding: '8px', lineHeight: '1.6', marginTop: '12px' }}>
                            <h1 style={{ padding: '5px', fontFamily: 'Acme', fontWeight: 'bold' }}>Role Manager</h1>
                            <h3 style={{ padding: '5px', fontFamily: 'Acme', fontWeight: 'bold' }}>Introduction</h3>
                            <div style={{ padding: '5px', }}>
                                <div style={{ marginTop: '10px', }}>
                                    The Role Manager page tab facilitates the creation of user groups,
                                    delineation of roles and associated responsibilities, grants access
                                    to specified users within those groups and create project sites and
                                    customized it as per the requirements. In essence, it streamlines
                                    the process of managing access and permissions for various roles.
                                </div>
                                <div style={{ marginTop: '20px', }}>
                                    After securely logging in CEMP platform with valid credentials, you can locate the Role Manager by navigating to the left sidebar, as indicated below:
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <img src={Img1} alt="Role Manager" />
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    Upon clicking on Role Manger tab from the sidebar, there are three sub buttons can be seen: Home, User Groups and Projects buttons (as depicted below).
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <img src={Img2} alt="Role Manager" />
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    When you click the <strong>Home</strong> button, you'll be presented with a concise overview of the Role Manager page, a list of onboarded projects, and information about existing user groups. Home button is accessible to all users. Read more <strong>(Guided tour)</strong> button will direct users to an additional static page—this very page—where they can find in-depth information about user groups and projects.
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <img src={Img3} alt="Role Manager" style={{ height: '80%', width: '90%' }}/>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    Within the Role Manager page, the second tab is labeled User Groups. Here, you’ll find a comprehensive list of existing user groups. Each entry includes details such as the group’s name, project alias, member count, and available actions. In the Actions column, you’ll have the options to view additional information, edit, or delete user groups. In the left corner, there is button of Create User Groups as shown in below image for creating user groups. The super admin will be given right to create new user group or delete any of the existing user group. Super Admin can also add/remove members into any of the existing group along with assigning/modifying the roles (admin, operator, engineer, member) for users. After then, it will be the duty of the relevant user group admin to add, remove, and amend group members' roles in addition to granting access to the various apps and features of the smart energy cloud.
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <img src={Img4} alt="Role Manager" style={{ height: '80%', width: '90%' }} />
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    Each user group has subsequent users, which can be accessed by clicking on any user groups. Once upon clicking upon the user group, it will show the list of users and each user has following information’s:
                                    <div style={{ marginTop: '20px' }}>
                                        <ul>
                                            <li>User Email</li>
                                            <li>Role</li>
                                            <li>Action</li>
                                        </ul>
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <img src={Img5} alt="Role Manager" style={{ height: '80%', width: '90%' }}/>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    Super admin can create the users and assigned the roles (Admin, Member, Operator and Engineer) subsequently. In case of larger number of users, particular user can be searched through search tab.
                                    <br />
                                    <br />
                                    Third button under Role Manager Page is <strong>Projects</strong>, which has details of projects created in the CEMP platforms. Upon clicking the projects button, it shows the details of projects along with Project Name, Project Alias, Project location and Actions. All users can view the page and see these details; however, projects can be created by Super Admin only and give rights to admin for further modifications.
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <img src={Img6} alt="Role Manager"  style={{ height: '80%', width: '90%' }} />
                                </div>
                            </div>
                        </div>
                    </>
                </Card.Body>
            </Card>
        </ProjectSite_Layout>
    )
}

export default GuidedTourRoleManager
