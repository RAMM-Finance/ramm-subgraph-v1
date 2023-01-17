import { MarketResolved, MarketDenied as MarketDeniedEvent, MarketApproved as MarketApprovedEvent, MarketInitiated as MarketInitiatedEvent, VaultCreated as VaultCreatedEvent, RedeemTransfer } from "../../generated/Controller/Controller"

import { SyntheticZCBPool as SyntheticZCBPoolContract } from "../../generated/Controller/SyntheticZCBPool"
import { CreditlineInstrument as CreditlineContract } from "../../generated/Controller/CreditlineInstrument"
import { Instrument as GeneralInstrumentContract } from "../../generated/Controller/Instrument"
import { PoolInstrument as PoolInstrumentContract } from "../../generated/Controller/PoolInstrument"
import { ERC20 as ERC20Contract } from "../../generated/Controller/ERC20"
import { ERC721 as ERC721Contract } from "../../generated/Controller/ERC721"
import { SyntheticZCBPool as BondPoolContract } from "../../generated/Controller/SyntheticZCBPool"
import { InstrumentDeposit, Vault as VaultContract } from "../../generated/Controller/Vault"


import { convertToDecimal } from "../utils/index"
import { BI_18, ZERO_BD, marketManagerContract, ZERO_BI, controllerContract, ADDRESS_ZERO, SECONDS_PER_YEAR, ONE_BD, MARKET_MANAGER_ADDRESS } from "../utils/constants"
import { GeneralInstrument, BondPool, Market, Token, Vault, CreditlineInstrument, PoolInstrument, PoolCollateral, ZCBToken } from "../../generated/schema"
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Vault as VaultTemplate } from "../../generated/templates"
import { MarketReputationSet } from "../../generated/Controller/MarketManager"

import { ZCBToken as ZCBTokenTemplate} from "../../generated/templates"

import { PoolInstrument as PoolInstrumentTemplate } from "../../generated/templates"

export function handleMarketApproved(event: MarketApprovedEvent): void {
  let market = Market.load(event.params.marketId.toString())

  if (market && market.vault) {
    let vaultContract = VaultContract.bind(Address.fromString(market.vault))
    let vault = Vault.load(market.vault)

    market.duringAssessment = false
    market.approvedPrincipal = convertToDecimal(event.params.data.approved_principal, BI_18)
    market.approvedYield = convertToDecimal(event.params.data.approved_yield, BI_18)

    if (market.instrumentType == BigInt.fromI32(2)) {
      let poolInstrumentId = market.poolInstrument

      if (poolInstrumentId!== null) {
        let instrument = PoolInstrument.load(poolInstrumentId)
        if (instrument) {
          let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
          if (!result.reverted) {
            instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
            instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
            instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
            instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
          }
    
          if (vault && vault.underlying && vault.vaultId) {
            instrument.underlyingBalance =
              convertToDecimal(ERC20Contract.bind(Address.fromString(vault.underlying)).balanceOf(Address.fromString(instrument.id)), BI_18)
            }
    
          instrument.save()
        }
      }
    } else if (market.instrumentType === BigInt.fromI32(0)) {
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

    if (vault) {
      let result = controllerContract.getVaultSnapShot(vault.vaultId)
      vault.totalEstimatedAPR = convertToDecimal(result.getTotalEstimatedAPR(), BI_18)
      vault.goalAPR = convertToDecimal(result.getGoalAPR(), BI_18)
      vault.totalProtection = convertToDecimal(result.getTotalProtection(), BI_18)
      vault.exchangeRate = convertToDecimal(result.getExchangeRate(), BI_18)
      vault.save()
    }

    market.save()
  }
}

export function handleMarketInitiated(event: MarketInitiatedEvent): void {

  // create new market entity
  let market = new Market(event.params.marketId.toString())
  market.vault = event.params.vault.toHexString()

  let vault = Vault.load(event.params.vault.toHexString())

  if (vault && vault.underlying) {
    vault.instrumentCount = vault.instrumentCount.plus(BigInt.fromI32(1))
    vault.marketIds = vault.marketIds.concat([event.params.marketId.toString()])
    vault.save()

    // get tokens
    let longZCB = new ZCBToken(event.params.longZCB.toHexString())
    let shortZCB = new ZCBToken(event.params.shortZCB.toHexString())

    // add datasources
    ZCBTokenTemplate.create(event.params.longZCB)
    ZCBTokenTemplate.create(event.params.shortZCB)

    const longContract = ERC20Contract.bind(event.params.longZCB)
    const shortContract = ERC20Contract.bind(event.params.shortZCB)

    longZCB.marketId = market.id
    longZCB.name = longContract.name()
    longZCB.decimals = BI_18
    longZCB.symbol = longContract.symbol()
    longZCB.totalSupply = convertToDecimal(longContract.totalSupply(), BI_18)

    longZCB.save()

    shortZCB.marketId = market.id
    shortZCB.name = shortContract.name()
    shortZCB.decimals = BI_18
    shortZCB.symbol = shortContract.symbol()
    shortZCB.totalSupply = convertToDecimal(shortContract.totalSupply(), BI_18)

    shortZCB.save()

    let bondPool = new BondPool(event.params.pool.toHexString())
    const bondPoolContract = SyntheticZCBPoolContract.bind(event.params.pool)

    bondPool.a_initial = convertToDecimal(bondPoolContract.a_initial(), BI_18)
    bondPool.b = convertToDecimal(bondPoolContract.b(), BI_18)
    bondPool.b_initial = convertToDecimal(bondPoolContract.b_initial(), BI_18)
    bondPool.discountCap = convertToDecimal(bondPoolContract.discount_cap(), BI_18)
    bondPool.discountedReserved = ZERO_BD;
    bondPool.longZCBPrice = convertToDecimal(bondPoolContract.getCurPrice(), BI_18)
    bondPool.longZCB = longZCB.id
    bondPool.shortZCB = shortZCB.id

    bondPool.save()

    market.bondPool = bondPool.id

    // market phase
    market.alive = true
    market.duringAssessment = true
    market.onlyReputable = true
    market.marketCondition = false
    market.atLoss = false
    market.resolved = false

    const phaseData = marketManagerContract.getPhaseData(event.params.marketId)
    market.baseBudget = convertToDecimal(phaseData.base_budget, BI_18)
    market.creationTimestamp = event.block.timestamp
    market.resolutionTimestamp = ZERO_BI

    const marketParameters = marketManagerContract.getParameters(event.params.marketId)

    market.N = marketParameters.N
    market.sigma = convertToDecimal(marketParameters.sigma, BI_18)
    market.alpha = convertToDecimal(marketParameters.alpha, BI_18)
    market.omega = convertToDecimal(marketParameters.omega, BI_18)
    market.delta = convertToDecimal(marketParameters.delta, BI_18)
    market.r = convertToDecimal(marketParameters.r, BI_18)
    market.s = convertToDecimal(marketParameters.s, BI_18)
    market.steak = convertToDecimal(marketParameters.steak, BI_18)

    market.redemptionPrice = ZERO_BD
    market.totalCollateral = ZERO_BD
    market.approvedPrincipal = ZERO_BD
    market.approvedYield = ZERO_BD

    const instrumentData = event.params.instrumentData;
    market.instrumentType = BigInt.fromI32(instrumentData.instrument_type)


    if (instrumentData.instrument_type === 0) {

      // creditline instrument created
      let instrument = new CreditlineInstrument(instrumentData.instrument_address.toHexString())
      let instrumentContract = CreditlineContract.bind(instrumentData.instrument_address)
      let underlyingContract = ERC20Contract.bind(Address.fromString(vault.underlying))

      // basic data
      instrument.market = market.id
      instrument.vault = event.params.vault.toHexString()
      instrument.utilizer = event.params.recipient.toHexString()
      instrument.name = instrumentData.name.toString()
      instrument.exposurePercentage = ZERO_BD
      instrument.managerStake = ZERO_BD
      instrument.approvalPrice = ZERO_BD
      instrument.underlyingBalance = convertToDecimal(underlyingContract.balanceOf(instrumentData.instrument_address), BI_18)
      instrument.seniorAPR = ZERO_BD
      instrument.principal = convertToDecimal(instrumentData.principal, BI_18)
      instrument.expectedYield = convertToDecimal(instrumentData.expectedYield, BI_18)
      instrument.duration = instrumentData.duration
      instrument.description = instrumentData.description

      let collateralType = CreditlineContract.bind(instrumentData.instrument_address).try_collateral_type();
      if (!collateralType.reverted) {
        instrument.collateralType = BigInt.fromI32(collateralType.value)   
      } else {
        instrument.collateralType = BigInt.fromI32(3)
      }

      instrument.save()

      market.creditlineInstrument = instrument.id

    } else if (instrumentData.instrument_type === 2) {

      // new data source added
      PoolInstrumentTemplate.create(event.params.instrumentData.instrument_address)

      // pool instrument created
      let instrument = new PoolInstrument(instrumentData.instrument_address.toHexString())
      let instrumentContract = PoolInstrumentContract.bind(instrumentData.instrument_address)
      let underlyingContract = ERC20Contract.bind(Address.fromString(vault.underlying))

      // basic data
      instrument.market = market.id
      instrument.vault = event.params.vault.toHexString()
      instrument.utilizer = event.params.recipient.toHexString()
      instrument.name = instrumentData.name.toString()
      instrument.exposurePercentage = ZERO_BD
      instrument.managerStake = ZERO_BD
      instrument.approvalPrice = ZERO_BD
      instrument.underlyingBalance = convertToDecimal(underlyingContract.balanceOf(instrumentData.instrument_address), BI_18)
      instrument.seniorAPR = ZERO_BD
      instrument.principal = ZERO_BD
      instrument.expectedYield = ZERO_BD
      instrument.duration = ZERO_BI

      const poolContract = PoolInstrumentContract.bind(Address.fromString(instrument.id))

      instrument.totalBorrowShares = ZERO_BD
      instrument.totalBorrowAssets = ZERO_BD
      instrument.totalSupplyAssets = convertToDecimal(poolContract.totalAssets(), BI_18);
      instrument.totalSupplyShares = convertToDecimal(poolContract.totalSupply(), BI_18);
      instrument.totalAvailableAssets = convertToDecimal(poolContract.totalAssetAvailable(), BI_18);
      instrument.borrowAPR = ZERO_BD
      instrument.description = instrumentData.description

      instrument.saleAmount = convertToDecimal(instrumentData.poolData.saleAmount, BI_18)
      instrument.initPrice = convertToDecimal(instrumentData.poolData.initPrice, BI_18)
      instrument.inceptionPrice = convertToDecimal(instrumentData.poolData.inceptionPrice, BI_18)
      instrument.leverageFactor = convertToDecimal(instrumentData.poolData.leverageFactor, BI_18)
      instrument.promisedReturn = convertToDecimal(instrumentData.poolData.promisedReturn, BI_18)
      instrument.inceptionTime = event.block.timestamp
      instrument.managementFee = ZERO_BD

      instrument.borrowAPR = convertToDecimal(instrumentContract.currentRateInfo().getRatePerSec(), BI_18).times(SECONDS_PER_YEAR)

      let collaterals = instrumentContract.getAcceptedCollaterals();
      // set collaterals
      for (let i = 0; i < collaterals.length; i++) {
        let collateralData = instrumentContract.collateralData(collaterals[i].tokenAddress, collaterals[i].tokenId)
        let _id = instrument.id.concat("-").concat(collaterals[i].tokenAddress.toHexString()).concat("-").concat(collaterals[i].tokenId.toString());
        let collateral = new PoolCollateral(_id);

        collateral.tokenAddress = collaterals[i].tokenAddress.toHexString()
        collateral.tokenId = collaterals[i].tokenId
        collateral.pool = instrument.id
        collateral.borrowAmount = convertToDecimal(collateralData.getMaxBorrowAmount(), BI_18)
        collateral.maxAmount = convertToDecimal(collateralData.getMaxAmount(), BI_18)
        collateral.isERC20 = collateralData.getIsERC20()
        collateral.totalSupplied = convertToDecimal(collateralData.getTotalCollateral(), BI_18)
        // collateral.owner = ADDRESS_ZERO
        // collateral.name = "unknown"
        // collateral.symbol = "unknown"

        if (collateral.isERC20) {
          // create ERC20Contract from collateral address
          let collateralContract = ERC20Contract.bind(collaterals[i].tokenAddress)
          collateral.symbol = collateralContract.symbol()
          collateral.name = collateralContract.name()
          collateral.decimals = BigInt.fromI32(collateralContract.decimals())
          collateral.owner = ADDRESS_ZERO
          
        } else {
          // create ERC721Contract from collateral address
          let collateralContract = ERC721Contract.bind(collaterals[i].tokenAddress)
          collateral.symbol = collateralContract.symbol()
          collateral.name = collateralContract.name()
          collateral.owner = instrumentContract.userCollateralNFTs(collaterals[i].tokenAddress, collaterals[i].tokenId).toHexString()
        }
        collateral.save()
      }

      instrument.save()

      market.poolInstrument = instrument.id

    } else if (instrumentData.instrument_type === 1) {
      let instrument = new GeneralInstrument(instrumentData.instrument_address.toHexString())
      let instrumentContract = GeneralInstrumentContract.bind(instrumentData.instrument_address)

      let underlyingContract = ERC20Contract.bind(Address.fromString(vault.underlying))

      instrument.market = market.id
      instrument.vault = event.params.vault.toHexString()
      instrument.utilizer = event.params.recipient.toHexString()
      instrument.name = instrumentData.name.toString()
      instrument.exposurePercentage = ZERO_BD
      instrument.managerStake = ZERO_BD
      instrument.approvalPrice = ZERO_BD
      instrument.underlyingBalance = convertToDecimal(underlyingContract.balanceOf(instrumentData.instrument_address), BI_18)
      instrument.seniorAPR = ZERO_BD
      instrument.principal = convertToDecimal(instrumentData.principal, BI_18)
      instrument.expectedYield = convertToDecimal(instrumentData.expectedYield, BI_18)
      instrument.duration = instrumentData.duration
      instrument.description = instrumentData.description
      instrument.save()

      market.generalInstrument = instrument.id
    } else if (instrumentData.instrument_type === 3) {
      let instrument = new GeneralInstrument(instrumentData.instrument_address.toHexString())
      let instrumentContract = GeneralInstrumentContract.bind(instrumentData.instrument_address)

      let underlyingContract = ERC20Contract.bind(Address.fromString(vault.underlying))

      instrument.market = market.id
      instrument.vault = event.params.vault.toHexString()
      instrument.utilizer = event.params.recipient.toHexString()
      instrument.name = instrumentData.name.toString()
      instrument.exposurePercentage = ZERO_BD
      instrument.managerStake = ZERO_BD
      instrument.approvalPrice = ZERO_BD
      instrument.underlyingBalance = convertToDecimal(underlyingContract.balanceOf(instrumentData.instrument_address), BI_18)
      instrument.seniorAPR = ZERO_BD
      instrument.principal = convertToDecimal(instrumentData.principal, BI_18)
      instrument.expectedYield = convertToDecimal(instrumentData.expectedYield, BI_18)
      instrument.duration = instrumentData.duration
      instrument.description = instrumentData.description
      instrument.save()

      market.generalInstrument = instrument.id
    } else if (instrumentData.instrument_type === 4) {
      let instrument = new GeneralInstrument(instrumentData.instrument_address.toHexString())
      let instrumentContract = GeneralInstrumentContract.bind(instrumentData.instrument_address)

      let underlyingContract = ERC20Contract.bind(Address.fromString(vault.underlying))

      instrument.market = market.id
      instrument.vault = event.params.vault.toHexString()
      instrument.utilizer = event.params.recipient.toHexString()
      instrument.name = instrumentData.name.toString()
      instrument.exposurePercentage = ZERO_BD
      instrument.managerStake = ZERO_BD
      instrument.approvalPrice = ZERO_BD
      instrument.underlyingBalance = convertToDecimal(underlyingContract.balanceOf(instrumentData.instrument_address), BI_18)
      instrument.seniorAPR = ZERO_BD
      instrument.principal = convertToDecimal(instrumentData.principal, BI_18)
      instrument.expectedYield = convertToDecimal(instrumentData.expectedYield, BI_18)
      instrument.duration = instrumentData.duration
      instrument.description = instrumentData.description
      instrument.save()

      market.generalInstrument = instrument.id
    }
    else {

      let instrument = new GeneralInstrument(instrumentData.instrument_address.toHexString())
      let instrumentContract = GeneralInstrumentContract.bind(instrumentData.instrument_address)

      let underlyingContract = ERC20Contract.bind(Address.fromString(vault.underlying))

      instrument.market = market.id
      instrument.vault = event.params.vault.toHexString()
      instrument.utilizer = event.params.recipient.toHexString()
      instrument.name = instrumentData.name.toString()
      instrument.exposurePercentage = ZERO_BD
      instrument.managerStake = ZERO_BD
      instrument.approvalPrice = ZERO_BD
      instrument.underlyingBalance = convertToDecimal(underlyingContract.balanceOf(instrumentData.instrument_address), BI_18)
      instrument.seniorAPR = ZERO_BD
      instrument.principal = convertToDecimal(instrumentData.principal, BI_18)
      instrument.expectedYield = convertToDecimal(instrumentData.expectedYield, BI_18)
      instrument.duration = instrumentData.duration
      instrument.description = instrumentData.description
      instrument.save()

      market.generalInstrument = instrument.id
    }

    // validator data
    market.valCap = convertToDecimal(controllerContract.getValidatorCap(event.params.marketId), BI_18)
    market.initialStake = convertToDecimal(controllerContract.getInitialStake(event.params.marketId), BI_18)
    market.finalStake = ZERO_BD
    market.validatorAveragePrice = convertToDecimal(controllerContract.getValidatorPrice(event.params.marketId), BI_18)
    market.validatorNumResolved = ZERO_BI
    market.validatorNumApproved = ZERO_BI
    market.validatorTotalZCB = ZERO_BI
    market.validatorTotalStaked = ZERO_BI

    market.save()
  }
}

export function handleMarketResolved(event: MarketResolved): void {
  let market = Market.load(event.params.marketId.toString())
  if (market != null) {
    market.resolved = true
    market.atLoss = event.params.atLoss
    market.extraGain = convertToDecimal(event.params.extraGain, BI_18)
    market.principalLoss = convertToDecimal(event.params.principalLoss, BI_18)
    market.prematureResolve = event.params.premature
    market.save()
  }
}

export function handleVaultCreated(event: VaultCreatedEvent): void {
  // create vault entity + add vault datasource
  let vault = new Vault(event.params.vault.toHexString())
  vault.vaultId = event.params.vaultId
  let underlying = new Token(event.params.underlying.toHexString())
  let underlyingContract =  ERC20Contract.bind(event.params.underlying)
  
  underlying.decimals = BigInt.fromI32(underlyingContract.decimals())
  underlying.name = underlyingContract.name()
  underlying.symbol = underlyingContract.symbol()
  underlying.totalSupply = convertToDecimal(underlyingContract.totalSupply(), underlying.decimals)
  underlying.save()
  
  vault.underlying = underlying.id
  vault.onlyVerified = event.params.onlyVerified

  vault.rVault = convertToDecimal(event.params.r, BI_18)
  vault.totalAssetLimit = convertToDecimal(event.params.totalAssetLimit, BI_18)
  vault.assetLimit = convertToDecimal(event.params.assetLimit, BI_18)
  vault.totalInstrumentHoldings = ZERO_BD

  vault.exchangeRate = ONE_BD
  vault.marketIds = []

  // bind vault contract
  let vaultContract = VaultContract.bind(event.params.vault)
  // get vault name and symbol
  vault.name = vaultContract.name()
  vault.symbol = vaultContract.symbol()
  vault.totalAssets = convertToDecimal(vaultContract.totalAssets(), BI_18)
  vault.totalSupply = convertToDecimal(vaultContract.totalSupply(), BI_18)
  vault.decimals = BI_18
  vault.description = vaultContract.description()


  const defaultMarketParameters = event.params.defaultParams

  vault.N = defaultMarketParameters.N
  vault.sigma = convertToDecimal(defaultMarketParameters.sigma, BI_18)
  vault.alpha = convertToDecimal(defaultMarketParameters.alpha, BI_18)
  vault.omega = convertToDecimal(defaultMarketParameters.omega, BI_18)
  vault.delta = convertToDecimal(defaultMarketParameters.delta, BI_18)
  vault.rMarket = convertToDecimal(defaultMarketParameters.r, BI_18)
  vault.s = convertToDecimal(defaultMarketParameters.s, BI_18)
  vault.steak = convertToDecimal(defaultMarketParameters.steak, BI_18)
  vault.instrumentCount = ZERO_BI

  vault.utilizationRate = ZERO_BD
  vault.totalEstimatedAPR = ZERO_BD
  vault.goalAPR = ZERO_BD
  vault.totalProtection = ZERO_BD

  vault.save()

  VaultTemplate.create(event.params.vault)
}

export function handleMarketDenied(event: MarketDeniedEvent): void {
  // denial is during assessment
  // remove instrument
  let market = Market.load(event.params.marketId.toString())

  // should remove on denial
  if (market) {
    let vault = Vault.load(market.vault)
    if (vault) {
      vault.instrumentCount = vault.instrumentCount.minus(BigInt.fromI32(1))
      vault.save()
    }

    market.alive = false;
    market.resolved = true;

    if (market.poolInstrument) {
      market.poolInstrument = null;
    }
    if (market.generalInstrument) {
      market.generalInstrument = null;
    }
    if (market.creditlineInstrument) {
      market.creditlineInstrument = null
    }

    market.save()
  }
}

export function handleRedeemTransfer(event: RedeemTransfer): void {
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

    if (market.duringAssessment) {
      let result = controllerContract.marketCondition(BigInt.fromString(market.id));
      market.marketCondition = result
      market.save()
    }
  }
}

