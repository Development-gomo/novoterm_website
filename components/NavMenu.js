// import { useEffect, useState } from 'react';
// import Link from 'next/link';

// export default function NavMenu() {
//   const [menu, setMenu] = useState(null);

//   useEffect(() => {
//     fetch('https://gomowebb.com/pratik-test/hackathon/wp-json/custom/v1/menus')
//       .then(res => res.json())
//       .then(data => {
//         const menu1 = data.find(m => m.name === 'Menu 1');
//         setMenu(menu1);
//       });
//   }, []);

//   if (!menu) return null;

//   return (
//     <nav>
//       <ul>
//         {menu.items.map(item => (
//           <li key={item.ID}>
//             <Link href={item.url}>
//               <a>{item.title}</a>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// }
