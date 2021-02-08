import MainLayout from "./MainLayout"
import styled from 'styled-components'

import { ErrorContainer as NoDataContainer } from "./ErrorPage"

const NoDataPage = () => {
  return (
    <MainLayout>
      <NoDataContainer>
        <div>
          No Data
        </div>
      </NoDataContainer>
    </MainLayout>
  )
}

export default NoDataPage