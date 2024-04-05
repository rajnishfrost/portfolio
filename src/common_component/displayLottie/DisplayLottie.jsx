import React, { Suspense} from "react";
import Lottie from "lottie-react";
import Loading from "../loading/Loading";

export default function DisplayLottie(props) {
  return (
    <Suspense fallback={<Loading />}>
        <Lottie
          animationData={props.animationData}
          loop={props.loop}
        />
      </Suspense>
  )
}

