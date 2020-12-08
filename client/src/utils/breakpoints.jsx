import { hideAt } from './make-responsive-css';
import styled from 'styled-components';

export const SmallAndBelow = styled.div`${hideAt({ min: '320px' })}`
export const MediumAndBelow = styled.div`${hideAt({ min: '768px' })}`
export const MediumOnly = styled.div`${hideAt({ max: '768px', min: '960px' })}`
export const MediumAndAbove = styled.div`${hideAt({ max: '768px' })}`
export const LargeAndAbove = styled.div`${hideAt({ max: '960px' })}`