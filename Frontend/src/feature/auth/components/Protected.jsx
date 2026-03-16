import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold animate-pulse text-red-800">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;




// import React from "react";
// import { useAuth } from "../hooks/useAuth";
// import { Navigate } from "react-router";

// const Protected = ({ children }) => {
//   const { loading, user } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen text-center flex justify-center items-center">
//         <p className="text-lg font-semibold animate-pulse">loading...</p>
//       </div>
//     );
//   }

//   if(!user){
//      return <Navigate to='/login' />
//   }


//   return (
//     children
//   );
// };

// export default Protected;
