import { DeactivatedMarket as DeactivatedMarketEvent} from "../../generated/MarketManager/MarketManager";

import { SyntheticZCBPool as SyntheticZCBPoolContract } from "../../generated/Controller/SyntheticZCBPool"
import { CreditlineInstrument as CreditlineContract} from "../../generated/Controller/CreditlineInstrument"
import { Instrument as GeneralInstrumentContract} from "../../generated/Controller/Instrument"
import { PoolInstrument as PoolInstrumentContract } from "../../generated/Controller/PoolInstrument"
import { ERC20 as ERC20Contract } from "../../generated/Controller/ERC20"
import { ERC721 as ERC721Contract } from "../../generated/Controller/ERC721"
import { Vault as VaultContract } from "../../generated/Controller/Vault"
import { SyntheticZCBPool as BondPoolContract } from "../../generated/Controller/SyntheticZCBPool"


import {convertToDecimal} from "../utils/index"
import { BI_18, ZERO_BD, marketManagerContract, ZERO_BI, controllerContract} from "../utils/constants"
import { Manager, ManagerMarketPair, Market, BondPool, Token, Vault, CreditlineInstrument, PoolInstrument, GeneralInstrument, ZCBToken } from "../../generated/schema"
import { BigInt, BigDecimal, Address, store } from '@graphprotocol/graph-ts'
import { Vault as VaultTemplate} from "../../generated/templates"
import { MarketApproved, MarketDenied } from "../../generated/Controller/Controller";
import { MarketCollateralUpdate, MarketParametersSet, MarketPhaseSet, RedeemDenied, SetParametersCall, TraderCollateralUpdate } from "../../generated/Controller/MarketManager";

export function handleDeactivatedMarket(event: DeactivatedMarketEvent):void {
    let market = Market.load(event.params.marketId.toString())
    if (market) {
        market.redemptionPrice = convertToDecimal(event.params.rp, BI_18)
        market.alive = false
        market.atLoss = event.params.atLoss
        market.resolved = true
        market.resolutionTimestamp = event.block.timestamp
        market.save()
    }
}

export function handleMarketApproved(event: MarketApproved):void {
    let market = Market.load(event.params.marketId.toString())
    if (market) {
        market.duringAssessment = false;
        market.save()
    }
}

export function handleMarketCollateralUpdate(event: MarketCollateralUpdate): void {
    let market = Market.load(event.params.marketId.toString())

    if (market) {
        let vault = Vault.load(market.vault)
        if (vault) {
            let result = controllerContract.getVaultSnapShot(vault.vaultId)
            vault.totalEstimatedAPR = convertToDecimal(result.getTotalEstimatedAPR(), BI_18)
            vault.goalAPR = convertToDecimal(result.getGoalAPR(), BI_18)
            vault.totalProtection = convertToDecimal(result.getTotalProtection(), BI_18)
            vault.exchangeRate = convertToDecimal(result.getExchangeRate(), BI_18)
            vault.save()
        }
        market.totalCollateral = convertToDecimal(event.params.totalCollateral, BI_18)

        if (market.duringAssessment) {
            let result = controllerContract.marketCondition(BigInt.fromString(market.id));
            market.marketCondition = result
        }

        if (market.instrumentType == BigInt.fromI32(2)) {
            let poolInstrumentId = market.poolInstrument
      
            if (poolInstrumentId!== null) {
              let instrument = PoolInstrument.load(poolInstrumentId)
              if (instrument) {
                let result = controllerContract.getInstrumentSnapShot(BigInt.fromString(instrument.market))
                instrument.exposurePercentage = convertToDecimal(result.getExposurePercentage(), BI_18)
                instrument.seniorAPR = convertToDecimal(result.getSeniorAPR(), BI_18)
                instrument.managerStake = convertToDecimal(result.getManagerStake(), BI_18)
                instrument.approvalPrice = convertToDecimal(result.getApprovalPrice(), BI_18)

                if (vault && vault.underlying) {
                  instrument.underlyingBalance =
                    convertToDecimal(ERC20Contract.bind(Address.fromString(vault.underlying)).balanceOf(Address.fromString(instrument.id)), BI_18)
                }
          
                instrument.save()
              }
            }
          } else if (market.instrumentType == BigInt.fromI32(0)) {
            let creditlineInstrumentId = market.creditlineInstrument
            if (creditlineInstrumentId !== null) {
              let instrument = CreditlineInstrument.load(creditlineInstrumentId)
              if (instrument) {
                let result = controllerContract.getInstrumentSnapShot(BigInt.fromString(instrument.market))
                instrument.exposurePercentage = convertToDecimal(result.getExposurePercentage(), BI_18)
                instrument.seniorAPR = convertToDecimal(result.getSeniorAPR(), BI_18)
                instrument.managerStake = convertToDecimal(result.getManagerStake(), BI_18)
                instrument.approvalPrice = convertToDecimal(result.getApprovalPrice(), BI_18)
                instrument.save()
              }
            }
          } else {
            let generalInstrumentId = market.generalInstrument
            if (generalInstrumentId !== null) {
              let instrument = GeneralInstrument.load(generalInstrumentId)
      
              if (instrument) {
                let result = controllerContract.getInstrumentSnapShot(BigInt.fromString(instrument.market))
                instrument.exposurePercentage = convertToDecimal(result.getExposurePercentage(), BI_18)
                instrument.seniorAPR = convertToDecimal(result.getSeniorAPR(), BI_18)
                instrument.managerStake = convertToDecimal(result.getManagerStake(), BI_18)
                instrument.approvalPrice = convertToDecimal(result.getApprovalPrice(), BI_18)
                instrument.save()
              }
            }
          }
        
        market.save()
    }
}

// export function handleMarketCreated(event: MarketCreated): void {
//     let market = new Market(event.params.marketId.toString())
//     if (market) {
//     }
// }

export function handleMarketDenied(event: MarketDenied): void {
    let market = Market.load(event.params.marketId.toString())
    if (market) {
        market.alive = false;
        market.resolved = true;
        market.save()
    }
}

export function handleMarketParametersSet(event: MarketParametersSet): void {
    let market = Market.load(event.params.marketId.toString())
    if (market) {
        let params = event.params.params
        market.N = params.N
        market.sigma = convertToDecimal(params.sigma, BI_18)
        market.alpha = convertToDecimal(params.alpha, BI_18)
        market.omega = convertToDecimal(params.omega, BI_18)
        market.delta = convertToDecimal(params.delta, BI_18)
        market.r = convertToDecimal(params.r, BI_18)
        market.s = convertToDecimal(params.s, BI_18)
        market.steak = convertToDecimal(params.steak, BI_18)
        market.save() 
    }
}

export function handleMarketPhaseSet(event: MarketPhaseSet): void {
    let market = Market.load(event.params.marketId.toString())
    if (market) {
        let phase = event.params.data
        market.duringAssessment = phase.duringAssessment
        market.onlyReputable = phase.onlyReputable

        market.baseBudget = convertToDecimal(phase.base_budget, BI_18)
        market.resolved = phase.resolved
        market.atLoss = phase.atLoss
        market.alive = phase.alive

        market.save()
    }
}

export function handleTraderCollateralUpdate(event: TraderCollateralUpdate): void {
    let managerMarketPairID = event.params.marketId.toString() + "-" + event.params.manager.toHexString()
    let manager = Manager.load(event.params.manager.toHexString())
    if (!manager) {
        manager = new Manager(event.params.manager.toHexString())
        manager.save()
    }
    // let managerMarketPair = .load(managerMarketPairID)
    let managerMarketPair = ManagerMarketPair.load(managerMarketPairID)
    if (managerMarketPair) {
        managerMarketPair.longZCBCollateral = event.params.isLong ? convertToDecimal(event.params.totalCollateral, BI_18) : managerMarketPair.longZCBCollateral 
        managerMarketPair.shortZCBCollateral = !event.params.isLong ? convertToDecimal(event.params.totalCollateral, BI_18) : managerMarketPair.shortZCBCollateral
        managerMarketPair.save()
    } else {
        let managerMarketPair = new ManagerMarketPair(managerMarketPairID)
        managerMarketPair.manager = event.params.manager.toHexString()
        managerMarketPair.market = event.params.marketId.toString()
        managerMarketPair.longZCBCollateral = event.params.isLong ? convertToDecimal(event.params.totalCollateral, BI_18) : ZERO_BD
        managerMarketPair.shortZCBCollateral = !event.params.isLong ? convertToDecimal(event.params.totalCollateral, BI_18) : ZERO_BD
        managerMarketPair.save()
    }
}

export function handlRedeemDenied(event: RedeemDenied): void {
    let market = Market.load(event.params.marketId.toString())
    let pairId = event.params.marketId.toString() + "-" + event.params.trader.toHexString()
    let managerMarketPair = ManagerMarketPair.load(pairId)
    if (managerMarketPair) {
        if (event.params.isLong) {
            managerMarketPair.longZCBCollateral = ZERO_BD
        } else {
            managerMarketPair.shortZCBCollateral = ZERO_BD
        }

        if (managerMarketPair.longZCBCollateral.equals(ZERO_BD) && managerMarketPair.shortZCBCollateral.equals(ZERO_BD)) {
            store.remove("ManagerMarketPair", pairId)
        } else {
            managerMarketPair.save()
        }
    }
}