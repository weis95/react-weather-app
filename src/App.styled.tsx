import styled, { css } from "styled-components"

interface Props {
  direction?: string
  justify?: string
  align?: string
  padding?: string
}

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 10px;
  @media (max-width: 900px) {
    grid-template-columns: 100%;
  }
`

export const GridContent = styled.div`
  grid-column-start: 2;
  @media (max-width: 900px) {
    grid-column-start: 1;
  }
`

export const Box = styled.div<Props>`
  display: flex;
  justify-content: ${(props) => props.justify};
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) => props.align};

  ${(props) =>
    props.padding &&
    css`
      padding: ${props.padding};
    `};
`
