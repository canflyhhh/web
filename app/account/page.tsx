'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
import styles from '../page.module.css';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from "@/app/_firebase/config";
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { signInWithGooglePopup } from "./admin"; // google login
import { useRouter } from 'next/navigation';
import { AuthContext } from './authContext';
import BadgeIcon from '@mui/icons-material/Badge';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

import axios from "axios";

export default function Account() {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const [account, setAccount] = useState({ email: "", password: "", name: ""
 });
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("登入");

    const [emailMessage, setEmailMessage] = useState({ email: '', subject: 'ReactGOGO帳號註冊成功', html: '恭喜您註冊成功' });
    const [response, setResponse] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState("");
    
    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }

    const changeStatus = function (e: React.MouseEvent<HTMLElement>) {
        if (status === "註冊") {
            setStatus("登入");
        }
        else {
            setStatus("註冊");
        }
    }

    // login - googleLogin
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        router.push('/');
        //console.log(response);
    }

    const handleSubmit = async function (e: React.MouseEvent<HTMLElement>) {
        console.log("status=", status);
        
        try {
            if (status === "註冊") {
                const res = await createUserWithEmailAndPassword(auth, account.email, account.password);
                const userDoc = await setDoc(doc(db, "users", res.user.uid), { email: account.email, name: account.name });
                    
                // send email after register (不要刪)
                // try {
                //     emailMessage.email = account.email
                //     const response = await axios({
                //       method: 'post',
                //       url: '/email',
                //       data: emailMessage,
                //     });
                //     setResponse(response.data.message);
                // } catch (error) {
                //     if (axios.isAxiosError(error)) {
                //       setResponse(error.message);
                //     } else {
                //       setResponse("錯誤");
                //     }
                // }
                // setMessage(`註冊成功，歡迎 ${res.user?.email}`);

                
                // setAccount({ ...account, password: "" });

                //setMessage(`註冊成功，請再次輸入密碼來登入系統`);
                setStatus("註冊成功");
                // setRegisteredEmail(account.email);

                router.push('/');
            }
            else {
                const res = await signInWithEmailAndPassword(auth, account.email, account.password);
                setMessage(`登入成功，歡迎 ${res.user?.email}`);

                router.push('/');
            }
        }
        catch(e) {
            if (e instanceof FirebaseError) {
                let message = "";
                switch (e.code) {
                    case "auth/email-already-in-use":
                        message = "電子信箱已註冊";
                        break;
                  case "auth/weak-password":
                        message = "密碼強度不足";
                        break;
                  case "auth/invalid-email":
                        message = "電子郵件格式錯誤";
                        break;
                  case "auth/user-not-found":
                        message = "電子郵件信箱不存在";
                        break;
                  case "auth/wrong-password":
                        message = "密碼錯誤";
                        break;
                  case "auth/too-many-requests":
                        message = "登入失敗次數過多，請稍後再試";
                        break;
                  default:
                    message = "系統錯誤:" + e.code;
                }
                setMessage(message);
            }
            else {
                if (e instanceof Error) {
                    setMessage(e.message);
                }
                else {
                    setMessage("系統錯誤");
                }
            }
        }
    }

    // useEffect(() => {
    //     setAccount({ email: "", password: "", name: "" });

    //     // 註冊後，自動代入帳號到登入頁面
    //     if (status === '註冊成功' && registeredEmail) {
    //         setAccount((prevAccount) => ({ ...prevAccount, email: registeredEmail }));
    //     }
    // }, [status, registeredEmail]);


    return (
        // <div className={styles.login}>
        <div style={{ padding: '6em' }}>   
            <Typography variant="h2" component="div" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <ConnectWithoutContactIcon sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'indianred', marginBottom: '0.2em' }} />
                <p style={{ fontSize: '20px' }}>登入之後就可以在react gogogo跟大家進行互動囉</p>
            </Typography>

            <Grid container>
                <Grid xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContext: 'middle' }}>
                <img src="../../fju.jpg" alt="歡迎" style={{ width: '100%', height: 'auto' }} />
                </Grid>
                <Grid xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContext: 'middle' }}>
                    <form>
                        {(status === '登入') &&
                            <div>
                                <div>
                                    <TextField type="email" name="email" value={account.email}
                                    placeholder="電子郵件信箱" label="電子郵件信箱：" onChange={handleChange} autoComplete='username' />
                                </div>

                                <br></br>

                                <div>
                                    <TextField type="password" name="password" value={account.password}
                                    placeholder="密碼" label="密碼：" onChange={handleChange} autoComplete='current-password' />
                                </div>

                                <br></br>

                                <div>
                                    <Grid container>
                                        <Grid xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContext: 'middle' }}>
                                            <Button variant="contained" color="primary" onClick={handleSubmit}>{status}</Button>
                                        </Grid>
                                        <Grid xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContext: 'middle' }}>
                                            <Button variant="contained" color="secondary" onClick={changeStatus}>註冊</Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        }

                        {(status === '註冊') &&
                            <div>
                                <div>
                                    {status === '註冊' && <TextField type="text" name="name" value={account.name}
                                        placeholder="暱稱" label="暱稱：" onChange={handleChange} />
                                    }
                                </div>

                                <br></br>

                                <div>
                                    <TextField type="email" name="email" value={account.email}
                                    placeholder="電子郵件信箱" label="電子郵件信箱：" onChange={handleChange} autoComplete='username' />
                                </div>

                                <br></br>

                                <div>
                                    <TextField type="password" name="password" value={account.password}
                                    placeholder="密碼" label="密碼：" onChange={handleChange} autoComplete='current-password' />
                                </div>

                                <br></br>

                                <div>
                                    <Grid container>
                                        <Grid xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContext: 'middle' }}>
                                            <Button variant="contained" color="primary" onClick={handleSubmit}>{status}</Button>
                                        </Grid>
                                        <Grid xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContext: 'middle' }}>
                                            <Button variant="contained" color="secondary" onClick={changeStatus}>登入</Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        }

                        <br></br>

                        <hr></hr>

                        <br></br>

                        <Grid container>
                            <Grid xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContext: 'middle' }}>
                                <Button variant="contained" color="secondary" onClick={logGoogleUser}>使用google帳號登入</Button>
                            </Grid>
                        </Grid>


                        <div>{message}</div>
        
                    </form>
                </Grid>
            </Grid>
        </div>
    )
}