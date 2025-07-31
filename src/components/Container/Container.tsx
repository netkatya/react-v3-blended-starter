import React from "react";

interface CotainerProps {
  children: React.ReactNode;
}

import styled from "./Container.module.css";

export default function Container({ children }: CotainerProps) {
  return <div className={styled.container}>{children}</div>;
}
