import { InstrumentDeposit as InstrumentDepositEvent, InstrumentHarvest, InstrumentRemoved, InstrumentTrusted, InstrumentWithdrawal as InstrumentWithdrawal, Transfer as TransferVaultEvent } from "../../generated/Controller/Vault"

import { SyntheticZCBPool as SyntheticZCBPoolContract } from "../../generated/Controller/SyntheticZCBPool"
import { CreditlineInstrument as CreditlineContract } from "../../generated/Controller/CreditlineInstrument"
import { Instrument as GeneralInstrumentContract } from "../../generated/Controller/Instrument"
import { Deposit, PoolInstrument as PoolInstrumentContract, Withdraw } from "../../generated/Controller/PoolInstrument"
import { ERC20 as ERC20Contract } from "../../generated/Controller/ERC20"
import { ERC721 as ERC721Contract } from "../../generated/Controller/ERC721"
import { Vault as VaultContract } from "../../generated/Controller/Vault"
import { dataSource, store } from "@graphprotocol/graph-ts"

import { Address, BigInt } from "@graphprotocol/graph-ts"

import { convertToDecimal } from "../utils/index"
import { BI_18, ZERO_BD, marketManagerContract, ZERO_BI, controllerContract } from "../utils/constants"

import { Vault, Market, CreditlineInstrument, PoolInstrument, GeneralInstrument, Token } from "../../generated/schema"

let vaultContract = VaultContract.bind(dataSource.address())

export function handleInstrumentDeposit(event: InstrumentDepositEvent): void {
    let vault = Vault.load(event.address.toHexString())

    let market = Market.load(event.params.marketId.toString())

    if (market && vault) {
        vault.exchangeRate = convertToDecimal(vaultContract.previewDeposit(BigInt.fromI32(10).pow(18)), BI_18)
        vault.totalInstrumentHoldings = vault.totalInstrumentHoldings.plus(convertToDecimal(event.params.amount, BI_18))
        vault.utilizationRate = convertToDecimal(vaultContract.utilizationRate(), BI_18)
        vault.save()
        let underlying = ERC20Contract.bind(Address.fromString(vault.underlying))

        if (market.instrumentType == BigInt.fromI32(0)) {
            let instrument = CreditlineInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }

                instrument.save()
            }
        } else if (market.instrumentType == BigInt.fromI32(2)) {
            let instrument = PoolInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }

                instrument.save()
            }
        } else {
            let instrument = GeneralInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }

                instrument.save()
            }
        }
    }

    if (vault) {
        let result = controllerContract.getVaultSnapShot(vault.vaultId)
        vault.totalEstimatedAPR = convertToDecimal(result.getTotalEstimatedAPR(), BI_18)
        vault.goalAPR = convertToDecimal(result.getGoalAPR(), BI_18)
        vault.totalProtection = convertToDecimal(result.getTotalProtection(), BI_18)
        vault.exchangeRate = convertToDecimal(result.getExchangeRate(), BI_18)
        vault.save()
    }
}

export function handleInstrumentWithdrawal(event: InstrumentWithdrawal): void {
    let vault = Vault.load(event.address.toHexString())
    let market = Market.load(event.params.marketId.toString())

    if (market && vault) {
        vault.exchangeRate = convertToDecimal(vaultContract.previewDeposit(BigInt.fromI32(10).pow(18)), BI_18)
        vault.totalInstrumentHoldings = vault.totalInstrumentHoldings.minus(convertToDecimal(event.params.amount, BI_18))
        vault.utilizationRate = convertToDecimal(vaultContract.utilizationRate(), BI_18)
        let underlying = ERC20Contract.bind(Address.fromString(vault.underlying))

        if (market.instrumentType == BigInt.fromI32(0)) {
            let instrument = CreditlineInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                instrument.save()
            }
        } else if (market.instrumentType == BigInt.fromI32(2)) {
            let instrument = PoolInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                instrument.save()
            }
        } else {
            let instrument = GeneralInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                instrument.save()
            }
        }

        vault.save()
    }

    if (vault) {
        let result = controllerContract.getVaultSnapShot(vault.vaultId)
        vault.totalEstimatedAPR = convertToDecimal(result.getTotalEstimatedAPR(), BI_18)
        vault.goalAPR = convertToDecimal(result.getGoalAPR(), BI_18)
        vault.totalProtection = convertToDecimal(result.getTotalProtection(), BI_18)
        vault.exchangeRate = convertToDecimal(result.getExchangeRate(), BI_18)
        vault.save()
    }
}

// export function handleInstrumentResolve(event: InstrumentResolve): void {
//     let vault = Vault.load(event.address.toHexString())
//     let market = Market.load(event.params.marketId.toString())

//     if (market) {
//         market.prematureResolve = event.params.prematureResolve
//         market.extraGain = convertToDecimal(event.params.extraGain, BI_18)
//         market.totalLoss = convertToDecimal(event.params.totalLoss, BI_18)
//         market.atLoss = event.params.atLoss
//         market.save()
//     }
// }

export function handleInstrumentTrusted(event: InstrumentTrusted): void {
    let vault = Vault.load(event.address.toHexString())
    let market = Market.load(event.params.marketId.toString())

    if (market && vault) {
        if (market.instrumentType == BigInt.fromI32(0)) {
            let creditline = CreditlineInstrument.load(event.params.instrument.toHexString())
            if (creditline) {
                creditline.principal = convertToDecimal(event.params.principal, BI_18)
                creditline.expectedYield = convertToDecimal(event.params.expectedYield, BI_18)
                creditline.maturityDate = event.params.maturityDate

                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(creditline.market))
                if (!result.reverted) {
                    creditline.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    creditline.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    creditline.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    creditline.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }

                creditline.save()
            }

        // IF NOT POOL INSTRUMENT
        } else if (market.instrumentType == BigInt.fromI32(2)) {
            let poolInstrument = PoolInstrument.load(event.params.instrument.toHexString())
            if (poolInstrument) {
                let vaultContract = VaultContract.bind(dataSource.address())

                let instrumentData = vaultContract.getInstrumentData(Address.fromString(poolInstrument.id))
                poolInstrument.inceptionTime = instrumentData.poolData.inceptionTime;
                poolInstrument.save()
            }
        } else {
            let generalInstrument = GeneralInstrument.load(event.params.instrument.toHexString())
            if (generalInstrument) {
                generalInstrument.principal = convertToDecimal(event.params.principal, BI_18)
                generalInstrument.expectedYield = convertToDecimal(event.params.expectedYield, BI_18)
                generalInstrument.maturityDate = event.params.maturityDate
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(generalInstrument.market))
                if (!result.reverted) {
                    generalInstrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    generalInstrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    generalInstrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    generalInstrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                generalInstrument.save()
            }
        }
    }
}

export function handleInstrumentHarvest(event: InstrumentHarvest): void {
    let instrumentData = vaultContract.getInstrumentData(event.params.instrument)

    let vault = Vault.load(dataSource.address().toHexString())
    if (vault) {
        vault.totalInstrumentHoldings = convertToDecimal(event.params.totalInstrumentHoldings, BI_18)
        let result = controllerContract.getVaultSnapShot(vault.vaultId)
        vault.totalEstimatedAPR = convertToDecimal(result.getTotalEstimatedAPR(), BI_18)
        vault.goalAPR = convertToDecimal(result.getGoalAPR(), BI_18)
        vault.totalProtection = convertToDecimal(result.getTotalProtection(), BI_18)
        vault.exchangeRate = convertToDecimal(result.getExchangeRate(), BI_18)
        vault.save()
    }
    if (instrumentData.instrument_type == 0) {
        let instrument = CreditlineInstrument.load(event.params.instrument.toHexString())
        if (instrument) {
            instrument.underlyingBalance = convertToDecimal(event.params.instrument_balance, BI_18)

            let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
            if (!result.reverted) {
                instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
            }
            instrument.save()
        }
    } else if (instrumentData.instrument_type == 2) {
        let instrument = PoolInstrument.load(event.params.instrument.toHexString())
        if (instrument) {
            instrument.underlyingBalance = convertToDecimal(event.params.instrument_balance, BI_18)
            let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
            if (!result.reverted) {
                instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
            }
            instrument.save()
        }
    } else {
        let instrument = GeneralInstrument.load(event.params.instrument.toHexString())
        if (instrument) {
            instrument.underlyingBalance = convertToDecimal(event.params.instrument_balance, BI_18)
            let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
            if (!result.reverted) {
                instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
            }
            instrument.save()
        }
    }

}

export function handleInstrumentRemoved(event: InstrumentRemoved): void {
    let market = Market.load(event.params.marketId.toString())
    if (market) {
        // based on the market.instrumetType, we can remove the instrument from the correct entity
        if (market.instrumentType == BigInt.fromI32(0)) {
            let creditline = CreditlineInstrument.load(event.params.instrumentAddress.toHexString())
            if (creditline && market.creditlineInstrument) {
                store.remove("CreditlineInstrument", creditline.id)
                market.creditlineInstrument = null
            }
        } else if (market.instrumentType == BigInt.fromI32(2)) {
            let pool = PoolInstrument.load(event.params.instrumentAddress.toHexString())
            if (pool && market.poolInstrument) {
                store.remove("PoolInstrument", pool.id)
                market.poolInstrument = null
            }
        } else {
            let general = GeneralInstrument.load(event.params.instrumentAddress.toHexString())
            if (general && market.generalInstrument) {
                store.remove("GeneralInstrument", general.id)
                market.generalInstrument = null
            }
        }
        market.save()

        let vault = Vault.load(market.vault)
        if (vault) {
            vault.instrumentCount = vault.instrumentCount.minus(BigInt.fromI32(1))
            vault.save()
        }
    }
}

export function handleTransfer(event: TransferVaultEvent): void {
    if (event.params.from === dataSource.address() || event.params.to === dataSource.address()) {
        let vault = Vault.load(dataSource.address().toHexString())
        if (vault) {
            vault.totalAssets = convertToDecimal(vaultContract.totalAssets(), BI_18);
            vault.totalInstrumentHoldings = convertToDecimal(vaultContract.totalInstrumentHoldings(), BI_18);
            vault.totalSupply = convertToDecimal(vaultContract.totalSupply(), BI_18);
            vault.exchangeRate = convertToDecimal(vaultContract.previewDeposit(BigInt.fromI32(10).pow(18)), BI_18);
            vault.utilizationRate = convertToDecimal(vaultContract.utilizationRate(), BI_18);

            let underlying = Token.load(vault.underlying)
            let underlyingContract = ERC20Contract.bind(Address.fromString(vault.underlying))
            if (underlying) {
                underlying.totalSupply = convertToDecimal(underlyingContract.balanceOf(Address.fromString(vault.id)), BI_18)
                underlying.save()
            }
            vault.save()
        }
    }
}

// export function handleMaturityDateSet(event: MaturityDateSet): void {
//     // get the market from the marketId field in the event, then get the instrument from the market based on the instrumentType, then update the maturityDate field of that instrument
//     let market = Market.load(event.params.marketId.toString())
//     if (market) {
//         switch (market.instrumentType) {
//             case "Creditline":
//                 let creditline = CreditlineInstrument.load(event.params.instrument.toHexString())
//                 if (creditline) {
//                     creditline.maturityDate = event.params.maturityDate
//                     creditline.save()
//                 }
//                 break
//             case "General":
//                 let general = GeneralInstrument.load(event.params.instrument.toHexString())
//                 if (general) {
//                     general.maturityDate = event.params.maturityDate
//                     general.save()
//                 }
//                 break
//         }
//     }
// }

export function handleDeposit(event: Deposit): void {
    let vault = Vault.load(dataSource.address().toHexString())

    if (vault) {
        vault.totalAssets = convertToDecimal(vaultContract.totalAssets(), BI_18)
        vault.totalSupply = convertToDecimal(vaultContract.totalSupply(), BI_18)
        vault.utilizationRate = convertToDecimal(vaultContract.utilizationRate(), BI_18)
        let result = controllerContract.getVaultSnapShot(vault.vaultId)
        vault.totalEstimatedAPR = convertToDecimal(result.getTotalEstimatedAPR(), BI_18)
        vault.goalAPR = convertToDecimal(result.getGoalAPR(), BI_18)
        vault.totalProtection = convertToDecimal(result.getTotalProtection(), BI_18)
        vault.save()

        let marketIds = vault.marketIds
        if (marketIds) {
            for (let i = 0; i < marketIds.length; i++) {
                let market = Market.load(marketIds[i])
                if (market) {
                    if (market.instrumentType == BigInt.fromI32(2)) {

                        let poolInstrumentId = market.poolInstrument

                        if (poolInstrumentId !== null) {
                            let instrument = PoolInstrument.load(poolInstrumentId)
                            if (instrument) {
                                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                                if (!result.reverted) {
                                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                                }

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
                                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                                if (!result.reverted) {
                                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                                }

                                if (vault && vault.underlying) {
                                    instrument.underlyingBalance =
                                        convertToDecimal(ERC20Contract.bind(Address.fromString(vault.underlying)).balanceOf(Address.fromString(instrument.id)), BI_18)
                                }
                                instrument.save()
                            }
                        }
                    } else {

                        let generalInstrumentId = market.generalInstrument
                        if (generalInstrumentId !== null) {
                            let instrument = GeneralInstrument.load(generalInstrumentId)

                            if (instrument) {
                                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                                if (!result.reverted) {
                                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                                }

                                if (vault && vault.underlying) {
                                    instrument.underlyingBalance =
                                        convertToDecimal(ERC20Contract.bind(Address.fromString(vault.underlying)).balanceOf(Address.fromString(instrument.id)), BI_18)
                                }
                                instrument.save()
                            }
                        }
                    }
                }
            }
        }

    }
}

export function handleWithdraw(event: Withdraw): void {
    let vault = Vault.load(dataSource.address().toHexString())

    if (vault) {
        vault.totalAssets = convertToDecimal(vaultContract.totalAssets(), BI_18)
        vault.totalSupply = convertToDecimal(vaultContract.totalSupply(), BI_18)

        let result = controllerContract.getVaultSnapShot(vault.vaultId)
        vault.totalEstimatedAPR = convertToDecimal(result.getTotalEstimatedAPR(), BI_18)
        vault.goalAPR = convertToDecimal(result.getGoalAPR(), BI_18)
        vault.totalProtection = convertToDecimal(result.getTotalProtection(), BI_18)
        vault.save()

        let marketIds = vault.marketIds
        if (marketIds) {
            for (let i = 0; i < marketIds.length; i++) {
                let market = Market.load(marketIds[i])
                if (market) {
                    if (market.instrumentType == BigInt.fromI32(2)) {
                        let poolInstrumentId = market.poolInstrument

                        if (poolInstrumentId !== null) {
                            let instrument = PoolInstrument.load(poolInstrumentId)

                            if (instrument) {
                                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                                if (!result.reverted) {
                                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                                }

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
                                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                                if (!result.reverted) {
                                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                                }

                                if (vault && vault.underlying) {
                                    instrument.underlyingBalance =
                                        convertToDecimal(ERC20Contract.bind(Address.fromString(vault.underlying)).balanceOf(Address.fromString(instrument.id)), BI_18)
                                }
                                instrument.save()
                            }
                        }
                    } else {
                        let generalInstrumentId = market.generalInstrument
                        if (generalInstrumentId !== null) {
                            let instrument = GeneralInstrument.load(generalInstrumentId)

                            if (instrument) {
                                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                                if (!result.reverted) {
                                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                                }

                                if (vault && vault.underlying) {
                                    instrument.underlyingBalance =
                                        convertToDecimal(ERC20Contract.bind(Address.fromString(vault.underlying)).balanceOf(Address.fromString(instrument.id)), BI_18)
                                }
                                instrument.save()
                            }
                        }
                    }
                }
            }
        }
    }
}
