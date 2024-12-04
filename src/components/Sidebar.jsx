import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import the icons
import { getAllConference } from "../services/ConferenceServices";
import {
  getConferenceById,
  editConference,
} from "../services/ConferenceServices";


const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedconference, setSelectedConference] = useState({});
  const [conference, setConference] = useState([]);
  const [data, SetData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };


    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getAllConference()
      .then((Response) => {
        setConference(Response.data);
        SetData(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      getConferenceById(conference_id)
        .then((Response) => {
          setSelectedConference(Response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setTemp(0);
  }, [temp]);

  const Menus = [
    {
      title: "Create Conference",
      src: "Chart_fill",
      path: "/create-conference",
    },
    {
      title: "Conference",
      src: "Chat",
      path: "/select-conference",
      subMenu: [
        { title: "Committees", path: "/committee" },
        { title: "Members", path: "/Members" },
        { title: "Tracks", path: "/tracks" },
        { title: "Reviewers", path: "/reviewers-registration" },
        {
          title: "Check Plagiarism",
          path: selectedconference?.plagiarismWebsite || "/select-conference/sub5",
          isExternal: !!selectedconference?.plagiarismWebsite,
        },
        {
          title: "Send for Copyright",
          path: selectedconference?.copyrightWebsite || "/select-conference/sub6",
          isExternal: !!selectedconference?.copyrightWebsite,
        },
        
        
        { title: "Author Registration", path: "/authors-registration" },
      ],
    },
    { title: "Allot Paper", src: "Calendar", path: "/allot-paper" },
    { title: "Reviewer Invitation", path: "/reviewer-invitation" },
    { title: "Review Format", src: "Search", path: "/review-format" },
    {
      title: "Report",
      src: "Chart",
      path: "/select-conference",
      subMenu: [
        {
          title: "Papers",
          subMenu: [
            { title: "List of papers", path: "/listofpapers" },
            { title: "Author-wise", path: "/authorwisepapers" },
            { title: "Track wise", path: "/trackwisepapers" },
            {
              title: "List of papers with status",
              path: "/papers_status_last_upload_date",
            },
            {
              title: "Decision wise list of papers",
              path: "/DecisionWiseListOfPapers",
            },
            {
              title: "List of papers send for plagiarism check",
              path: "/Paperswithplagiarism",
            },
            {
              title: "List of papers send for copyright",
              path: "/Papercopyright",
            },
            {
              title: "Authors",
              subMenu: [
                { title: "List of all authors", path: "/listofallauthors" },
                { title: "List of first authors", path: "/listoffirstauthors" },
              ],
            },
          ],
        },
        {
          title: "Review",
          subMenu: [
            { title: "List of reviewers", path: "/listofreviewers" },
            {
              title: "List of papers reviewer wise",
              path: "/Reviewerwisepapers",
            },
            {
              title: "List of papers with reviewers name",
              path: "/papers_with_reviewers",
            },
          ],
        },
        {
          title: "Committee and members",
          subMenu: [
            { title: "List of committees", path: "/ListCommittee" },
            { title: "List of all members", path: "/listofallmembers" },
            {
              title: "List of members committee wise",
              path: "/CommitteewiseMembers",
            },
            { title: "TPC Members", path: "/tpcmembers" },
          ],
        },
      ],
    },
    // {
    //   subMenu: [
    //     { title: "List of Papers", path: "/listofpapers" },
    //     { title: "Authors-wise List of Papers", path: "/authorwisepapers" },
    //     { title: "Track-wise List of Papers", path: "/trackwisepapers" },
    //     { title: "TPC Members", path: "/tpcmembers" },
    //     { title: "List of Reviewers", path: "/listofreviewers" },
    //     { title: "List of First Authors", path: "/listoffirstauthors" },
    //     { title: "List of All Authors", path: "/Listofallauthors" },
    //     {
    //       title: "List of Papers with Status and Last Date of Upload",
    //       path: "/papers_status_last_upload_date",
    //     },
    //     {
    //       title: "List of Papers with Reviewers",
    //       path: "/papers_with_reviewers",
    //     },
    //     {
    //       title: "List of Papers Allotted to the Reviewers",
    //       path: "/paper_allot_reviewer_report",
    //     },
    //     {
    //       title: "List of Papers Sent for Copyright",
    //       path: "/paper_sent_copy_right",
    //     },
    //     { title: "List of Committee Members", path: "/list_committee_members" },
    //   ],
    // },
  ];

  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const [submenuVisibility, setSubmenuVisibility] = useState({});

  const renderSubMenu = (subMenu, subIndex) => {
    return (
      <ul
        className={`${
          !open && "hidden"
        } pl-9 mt-2 space-y-2 rounded-md bg-yellow-400`}
      >
        {subMenu.map((subMenuItem, subSubIndex) => (
          <li key={subSubIndex} className={`text-black text-sm`}>
            <div className="flex justify-between items-center">
              {subMenuItem.isExternal ? (
                <a
                  href={subMenuItem.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:text-white`}
                >
                  {subMenuItem.title}
                </a>
              ) : (
                <Link to={subMenuItem.path} className={`hover:text-white`}>
                  {subMenuItem.title}
                </Link>
              )}
              {subMenuItem.subMenu && (
                <button
                  className="text-black"
                  onClick={() => {
                    setSubmenuVisibility((prevVisibility) => ({
                      ...prevVisibility,
                      [subSubIndex]: !prevVisibility[subSubIndex],
                    }));
                  }}
                >
                  {submenuVisibility[subSubIndex] ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
              )}
            </div>
            {subMenuItem.subMenu && submenuVisibility[subSubIndex] && (
              <div className="pl-4">
                {renderSubMenu(subMenuItem.subMenu, subSubIndex)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };
  

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-yellow-500 h-screen overflow-y-auto p-4 pt-4 relative duration-300 max-h-screen`}
      >
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li key={index} className="relative">
            <div className="flex justify-between items-center">
              {Menu.isExternal ? (
                <a
                  href={Menu.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-black text-sm items-center gap-x-4`}
                >
                  <span className={`${!open && "hidden"} origin-left duration-200`}>
                    {Menu.title}
                  </span>
                </a>
              ) : (
                <Link
                  to={Menu.path}
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-black text-sm items-center gap-x-4`}
                >
                  <span className={`${!open && "hidden"} origin-left duration-200`}>
                    {Menu.title}
                  </span>
                </Link>
              )}
              {Menu.subMenu && (
                <button
                  onClick={() => toggleSubMenu(index)}
                  className="text-black"
                >
                  {activeMenu === index ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              )}
            </div>
            {Menu.subMenu && activeMenu === index && renderSubMenu(Menu.subMenu, index)}
          </li>
          
          ))}
        </ul>
      </div>
    </div>
  );
};

//   return (
//     <div className="flex">
//       <div
//         className={` ${
//           open ? "w-64" : "w-20"
//         } bg-yellow-500 h-auto p-10 pt-4 relative duration-300`}
//       >
//         <ul className="pt-6">
//           {Menus.map((Menu, index) => (
//             <li key={index} className="relative">
//               <div className="flex justify-between items-center">
//                 {/* Main Link for Navigation */}
//                 <Link
//                   to={Menu.path}
//                   className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-black text-sm items-center gap-x-4 ${
//                     Menu.gap ? "mt-9" : "mt-2"
//                   } ${index === 0 && "bg-light-white"}`}
//                 >
//                   <span
//                     className={`${!open && "hidden"} origin-left duration-200`}
//                   >
//                     {Menu.title}
//                   </span>
//                 </Link>

//                 {/* Dropdown Icon (Only for menus with subMenu) */}
//                 {Menu.subMenu && (
//                   <button
//                     onClick={() => toggleSubMenu(index)}
//                     className="text-black"
//                   >
//                     {activeMenu === index ? <FaChevronUp /> : <FaChevronDown />}
//                   </button>
//                 )}
//               </div>

//               {/* Submenu */}
//               {Menu.subMenu && activeMenu === index && (
//                 <ul
//                   className={`${
//                     !open && "hidden"
//                   } pl-9 mt-2 space-y-2 border border-yellow-300 rounded-md bg-yellow-400`}
//                 >
//                   {Menu.subMenu.map((subMenuItem, subIndex) => (
//                     <li key={subIndex} className={`text-black text-sm`}>
//                       <Link
//                         to={subMenuItem.path}
//                         className={`hover:text-white`}
//                       >
//                         {subMenuItem.title}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

export default Sidebar;
