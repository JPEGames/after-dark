module.exports = function (sequelizeInstance) {
  let air = {
    amount: sequelizeInstance.air,
    rate: sequelizeInstance.airProduction,
    capacity: sequelizeInstance.airCapacity
  }
  let electricity = {
    amount: sequelizeInstance.electricity,
    rate: sequelizeInstance.electricityProduction,
    capacity: sequelizeInstance.electricityCapacity
  }
  let water = {
    amount: sequelizeInstance.water,
    rate: sequelizeInstance.waterProduction,
    capacity: sequelizeInstance.waterCapacity
  }
  let cpu = {
    amount: sequelizeInstance.maxCpu,
    usage: sequelizeInstance.cpuUsage,
    allocation: sequelizeInstance.cpuAllocation
  }
  let money = sequelizeInstance
  return {money, air, electricity, water, cpu}
}
