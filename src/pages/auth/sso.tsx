
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { any, z } from "zod";


import Loader from '../../components/loader/Loader';
import { useLoadertime } from "../../contexts/loadertimeContext";
import { useSearchParams, useNavigate } from "react-router-dom";


import axios from 'axios';
import { User, UserRole } from "@/types";
import { authAPI } from "../../api/authAPI"; // ADDED ON 30-04-2025//////



const SSO = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const loadintime = useLoadertime();
  const [searchparams] = useSearchParams();
  const userVal = searchparams.get("user");
  const tokenVal = searchparams.get("token");
  const navigate = useNavigate();



  // useEffect(() => {
  //   // Check if user is stored in localStorage on component mount
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     // setUser(JSON.parse(storedUser));
  //     navigate("/stores");
  //   }
  // }, [navigate]); // Remove user from dependencies


  useEffect(() => {
    validate();
  }, [tokenVal, navigate]);
  const validate = async () => {
    try {
      setUser(null); // Clear user state on component mount
      localStorage.clear();
      setLoading(true);
      const response = await axios.post('https://uat.wowmomo.com:2220/validateUser', {
        user: userVal,
        token: tokenVal
      });

      if (response.data.success === true) {
        const ssologinuser = await authAPI.ssologin(response.data);
        if (ssologinuser) {
          localStorage.setItem("user", JSON.stringify(ssologinuser));
          setUser(ssologinuser); // Set user directly from response
          navigate("/stores"); // Navigate immediately after setting user
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error('Error validating user:', error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Loader loading={loading} />
    </>
  );
};

export default SSO;
