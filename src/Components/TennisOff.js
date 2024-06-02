import React, { useEffect } from "react";

const TennisOff = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.tennisoff.net/livelink/show?leaderid=raising_2004&lmt=5&ord_col=dt&ord_desc=1&o_rec=1&o_wal=1&o_rep=1&o_com=1&o_abo=0&js_br=0";
    script.charset = "UTF-8";
    script.async = true;

    script.onload = () => {
      console.log("TennisOff script loaded successfully");
      // スクリプトが提供する機能をここで使用する
    };

    script.onerror = () => {
      console.error("Failed to load TennisOff script");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="TennisOff"></div>;
};

export default TennisOff;
