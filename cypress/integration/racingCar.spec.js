import { RacingCar, RacingCars } from "../../src/js/component/racingCar"
import { BOUNDARY, NUMBERS } from "../../src/js/utils/constant";

describe('자동차 객체를 테스트', () => {
  const name = "이름";
  let car;
  
  beforeEach('자동차 초기화', () => {
    car = new RacingCar(name);
  })
  
  it('자동차 객체를 생성한다.', () => {
    cy.wrap(car)
      .invoke('status')
      .should('deep.eq', [name, NUMBERS.INIT_NUM])
  })

  const movement = movable => 
    cy.wrap(car)
      .invoke('move', movable)
  
  const checkForward = number => 
    cy.wrap(car)
      .invoke('getForward')
      .should('eq', number)

  it('자동차는 전진할 수 있다.', () => {
    movement(true)
    checkForward(NUMBERS.INIT_NUM + 1)
  })

  it('자동차는 멈출 수 있다.', () => {
    movement(false)
    checkForward(NUMBERS.INIT_NUM)
  })

  it('해당하는 시간초에 움직일 수 있는가', () => {
    cy.wrap(car)
      .invoke('isMovableTime', 1)
      .should('eq', false)

    movement(true)
    
    cy.wrap(car)
      .invoke('isMovableTime', 1)
      .should('eq', true)
  })
})


describe('자동차목록을 테스트', () => {
  const carNames = ['이름1', '이름2', '이름3'];
  const tryNum = 5;
  let cars;

  beforeEach('자동차들을 초기화', () => {
    cars = new RacingCars();
    cars.setNames(carNames);
  })

  it('n대의 자동차를 보유', () => {
    cy.wrap(cars)
      .invoke('getCarsStatus')
      .its('length')
      .should('eq', carNames.length)

    const predict = [];
    carNames.forEach(carName => predict.push([carName, NUMBERS.INIT_NUM]));

    cy.wrap(cars)
      .invoke('getCarsStatus')
      .should('deep.eq', predict)
  })

  const movement = movable => {
    cy.stub(Math, 'random').returns(movable ? NUMBERS.RANDOM_BOUND * BOUNDARY.FORWARD : 0)
    cy.wrap(cars)
      .invoke('move', tryNum)
  }

  const checkForwards = number => 
    cy.wrap(cars)
      .invoke('getForward')
      .each(forwards => cy.wrap(forwards).should('eq', number))


  it('주어진 횟수만큼 자동차들은 전진할 수 있다.', () => {
    movement(true)
    checkForwards(NUMBERS.INIT_NUM + tryNum)
  })

  it('주어진 횟수만큼 자동차들은 멈출 수 있다.', () => {
    movement(false)
    checkForwards(NUMBERS.INIT_NUM)
  })

  it('우승자를 찾을 수 있다', () => {
    movement(true)
    cy.wrap(cars)
      .invoke('winner')
      .should('deep.eq', carNames)
  })
})

