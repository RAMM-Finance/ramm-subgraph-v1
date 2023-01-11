/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { MarketManager as MarketManagerContract } from '../../generated/Controller/MarketManager'
import { Controller as ControllerContract } from "../../generated/Controller/Controller"

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const MARKET_MANAGER_ADDRESS = '0xAA3b8bd9704973Fe955255d513447DCD2BA63b62'
export const CONTROLLER_ADDRESS = '0x292f3b655c8028b5A66FcA3a95196442847d0727'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)


export const SECONDS_PER_YEAR = BigDecimal.fromString("31536000")

export let marketManagerContract = MarketManagerContract.bind(Address.fromString(MARKET_MANAGER_ADDRESS))
export let controllerContract = ControllerContract.bind(Address.fromString(CONTROLLER_ADDRESS))