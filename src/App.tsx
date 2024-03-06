import "./styles.css";
import { KukaiEmbed, LoginInfo, Networks } from "kukai-embed";
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
      const user = await kukaiEmbed.current!.login();
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <h1>Demo</h1>
      <button onClick={handleClick} disabled={!isReady}>
        Sign in
      </button>
    </div>
  );
}
