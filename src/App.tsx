import "./styles.css";
import { KukaiEmbed, LoginInfo, Networks, TypeOfLogin } from "kukai-embed";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const kukaiEmbed = useRef<KukaiEmbed>();

  const [user, setUser] = useState<LoginInfo | null>(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    init();
  }, [setReady]);

  async function init() {
    if (kukaiEmbed.current) {
      return;
    }

    kukaiEmbed.current = new KukaiEmbed({ net: Networks.ghostnet });

    try {
      await kukaiEmbed.current.init();
    } catch {
      console.trace();
      return;
    }

    const { user } = kukaiEmbed.current;
    setUser(user);
    setReady(true);
  }

  async function handleClick() {
    try {
      const user = await kukaiEmbed.current!.login({
        loginOptions: [
          TypeOfLogin.Google,
          TypeOfLogin.Twitter,
          TypeOfLogin.Facebook,
          TypeOfLogin.Reddit,
          "email" as TypeOfLogin,
        ],
        wideButtons: [true, true, false, false, false],
      });
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogout() {
    try {
      await kukaiEmbed.current!.logout();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <h1>Demo</h1>
      <button onClick={handleClick} disabled={!isReady || !!user}>
        Sign in
      </button>
      <hr />
      {!!user && <button onClick={handleLogout}>Log out</button>}
    </div>
  );
}
