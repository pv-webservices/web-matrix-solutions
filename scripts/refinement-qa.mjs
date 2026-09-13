import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const report=[];
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'no-preference'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
 await page.waitForTimeout(3400);
 await page.screenshot({path:`qa/refinement-hero-${width}.png`});
 await page.locator('.technology-section').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
 const track=page.locator('.technology-track');const before=await track.evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(300);const after=await track.evaluate(e=>getComputedStyle(e).transform);
 if(before===after)throw new Error('Technology bar is not moving');
 await page.getByRole('button',{name:'Pause technology bar'}).click();const paused=await track.evaluate(e=>getComputedStyle(e).animationPlayState);if(paused!=='paused')throw new Error('Pause control failed');
 await page.screenshot({path:`qa/refinement-technologies-${width}.png`});
 const data=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,heading:document.querySelector('h1')?.getAttribute('aria-label'),lettersVisible:[...document.querySelectorAll('.hero-letter')].every(e=>Number(getComputedStyle(e).opacity)===1),logos:[...document.querySelectorAll('.technology-group:first-child img')].every(e=>e.complete&&e.naturalWidth>0),sectionPadding:getComputedStyle(document.querySelector('#work')).paddingTop}));
 report.push({...data,marqueeMoving:before!==after,paused,errors});await page.close();
}
await fs.writeFile('qa/refinement-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
