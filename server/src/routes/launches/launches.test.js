const request = require('supertest')
const app = require('../../app')

const { mongoConnect, mongoDisconnect} = require('../../Services/mongo')

describe('Launches API', () =>{
      beforeAll(async () => {
        await  mongoConnect()
       });     

      afterAll( async () =>{
        await mongoDisconnect()
      })

    describe('Test GET /launch', () =>{
        test('It should respond with 201 success', async () =>{
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        })
    })
    
    
    describe('Test POST /launch',() =>{
        const LaunchDataWithoutDate = {
            
                mission: 'USS Enterprise',
                rocket: 'NCC 1701 -D',
                target: "Kepler-62 f",
                
            
        }
        const completeLaunchData = {
            
            mission: 'USS Enterprise',
            rocket: 'NCC 1701 -D',
            target: "Kepler-62 f",
            launchDate: "January 4, 2028"
        
    }
    
    
        const invalidDate = {
            
            mission: 'USS Enterprise',
            rocket: 'NCC 1701 -D',
            target: "Kepler-62 f",
            launchDate: "Manuel"
        
    }
        test('It should respond with 201 success', async()=>{
            const response =  await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201)
    
    
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf()
            const responseDate = new Date( response.body.launchDate).valueOf()
            expect(responseDate).toBe(requestDate)
    
            expect(response.body).toMatchObject(
                LaunchDataWithoutDate
            )
        })
    
            test('It should catch missing required properties', async() =>{
                const response =  await request(app)
                .post('/v1/launches')
                .send(LaunchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
                
                expect(response.body).toStrictEqual({
                 error: "missing required launch properties",
                });
            })
    
    
            test('It should catch invalid date', async() =>{
                const response =  await request(app)
                .post('/v1/launches')
                .send(invalidDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
                expect(response.body).toStrictEqual({
                    error: "invalid launch Date",
                });
            })
       
        })
    

})




// const request = require('supertest')
// const app = require('../../app')

// describe('Test, GET /launches', () =>{
//     test('it should respond with 201 success', async() => {
//         const response = await request(app)
//         .get('/launches')
//         .expect('Content-Type, /json/')
//         .expect(200)
//     });
// })



// describe('Test, POST /launches', () =>{
// test('it should respond with 201 success', async() =>{
//     const response = await request(app)
//     .post('/launches')
//     .send({
//         mission: 'USS Enterprise',
//         rocket: 'NCC 1701 -D',
//         target: "Kepler- 186 f",
//         launchDate: "January 4, 2028"
//     })
//     .expect(201)
// })

// test('it should respond with 201 success', () =>{})
// test('it should catch missing require properties', () =>{})
// test('it should catch invalid date properties', () =>{})
// })