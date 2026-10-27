export async function run({page,assert,waitForQuiescence}){
 await page.waitForSelector('#options button');
 assert.equal(await page.locator('#options button').count(),3,'Original short-answer exercise has 3 options');
 const before=await page.locator('#passage').textContent();
 await page.locator('#options button').nth(0).click();
 await page.waitForSelector('.reason-row');
 assert.equal(await page.locator('.reason-row').count(),3,'Every answer option explained');
 assert.equal(await page.locator('.result-icon.correct-icon').count()>0,true,'Correct option marked green');
 assert.equal(await page.locator('.result-icon.wrong-icon').count()>0,true,'Incorrect options marked red');
 await page.locator('#answer').fill('The verb slammed tells us the door closed with a loud bang.');
 await page.waitForTimeout(50);
 const answer=await page.locator('#answer').inputValue();
 assert.equal(answer.includes('slammed'),true,'Typed practice remains available');
 await waitForQuiescence(async()=>({text:await page.locator('#answer').inputValue(),quote:await page.locator('#passage').textContent()}));
 assert.equal(await page.locator('#passage').textContent(),before,'Original quotation unchanged');
}
