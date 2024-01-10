import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { later } from '@ember/runloop';
import ENV from 'genuine-captcha-web/config/environment';

var _quotes = [ //132
"The greatest glory in living lies not in never falling, but in rising every time we fall. -Nelson Mandela",
"The way to get started is to quit talking and begin doing. -Walt Disney",
"Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking. -Steve Jobs",
"The future belongs to those who believe in the beauty of their dreams. -Eleanor Roosevelt",
"If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough. -Oprah Winfrey",
"If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success. -James Cameron",
"You may say I'm a dreamer, but I'm not the only one. I hope someday you'll join us. And the world will live as one. -John Lennon",
"You must be the change you wish to see in the world. -Mahatma Gandhi",
"Spread love everywhere you go. Let no one ever come to you without leaving happier. -Mother Teresa",
"The only thing we have to fear is fear itself. -Franklin D. Roosevelt",
"Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that. -Martin Luther King Jr.",
"Do one thing every day that scares you. -Eleanor Roosevelt",
"Well done is better than well said. -Benjamin Franklin",
"The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. -Helen Keller",
"It is during our darkest moments that we must focus to see the light. -Aristotle",
"Do not go where the path may lead, go instead where there is no path and leave a trail. -Ralph Waldo Emerson",
"Be yourself; everyone else is already taken. -Oscar Wilde",
"You will face many defeats in life, but never let yourself be defeated. -Maya Angelou",
"Go confidently in the direction of your dreams! Live the life you've imagined. -Henry David Thoreau",
"In the end, it's not the years in your life that count. It's the life in your years. -Abraham Lincoln",
"Never let the fear of striking out keep you from playing the game. -Babe Ruth",
"In this life we cannot do great things. We can only do small things with great love. -Mother Teresa",
"Many of life's failures are people who did not realize how close they were to success when they gave up. -Thomas A. Edison",
"You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. -Dr. Seuss",
"If life were predictable it would cease to be life and be without flavor. -Eleanor Roosevelt",

"In the end, it's not the years in your life that count. It's the life in your years. -Abraham Lincoln",

"Life is a succession of lessons which must be lived to be understood. -Ralph Waldo Emerson",

"You will face many defeats in life, but never let yourself be defeated. -Maya Angelou",

"Never let the fear of striking out keep you from playing the game. -Babe Ruth",

"Life is never fair, and perhaps it is a good thing for most of us that it is not. -Oscar Wilde",

"The only impossible journey is the one you never begin. -Tony Robbins",

"In this life we cannot do great things. We can only do small things with great love. -Mother Teresa",

"Only a life lived for others is a life worthwhile. -Albert Einstein",

"The purpose of our lives is to be happy. -Dalai Lama",

"You may say I'm a dreamer, but I'm not the only one. I hope someday you'll join us. And the world will live as one. -John Lennon",

"You only live once, but if you do it right, once is enough. -Mae West",

"To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. -Ralph Waldo Emerson",

"Don't worry when you are not recognized, but strive to be worthy of recognition. -Abraham Lincoln",

"The greatest glory in living lies not in never falling, but in rising every time we fall. -Nelson Mandela",

"Life is really simple, but we insist on making it complicated. -Confucius",

"May you live all the days of your life. -Jonathan Swift",

"Life itself is the most wonderful fairy tale. -Hans Christian Andersen",

"Do not let making a living prevent you from making a life. -John Wooden",

"Go confidently in the direction of your dreams! Live the life you've imagined. -Henry David Thoreau",
"Life is either a daring adventure or nothing. -Helen Keller",
"Life is a long lesson in humility. -James M. Barrie",
"In three words I can sum up everything I've learned about life: it goes on. -Robert Frost",
"You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. -Dr. Seuss",
"Life is made of ever so many partings welded together. -Charles Dickens",
"Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma - which is living with the results of other people's thinking. -Steve Jobs",
"Life is trying things to see if they work. -Ray Bradbury",
"Keep smiling, because life is a beautiful thing and there's so much to smile about. -Marilyn Monroe",

"In the depth of winter, I finally learned that within me there lay an invincible summer. -Albert Camus",

"In three words I can sum up everything I've learned about life: it goes on. -Robert Frost",

"So we beat on, boats against the current, borne back ceaselessly into the past. -F. Scott Fitzgerald",

"Life is either a daring adventure or nothing. -Helen Keller",

"You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. -Dr. Seuss",

"Life is made of ever so many partings welded together. -Charles Dickens",

"Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma - which is living with the results of other people's thinking. -Steve Jobs",

"Life is trying things to see if they work. -Ray Bradbury",

"Many of life's failures are people who did not realize how close they were to success when they gave up. -Thomas A. Edison",

"Success is not final; failure is not fatal: It is the courage to continue that counts. -Winston S. Churchill",
"Success usually comes to those who are too busy to be looking for it. -Henry David Thoreau",
"If you want to make your dreams come true, the first thing you have to do is wake up. -J.M. Power",
"If you really look closely, most overnight successes took a long time. -Steve Jobs",
"The secret of success is to do the common thing uncommonly well. -John D. Rockefeller Jr.",
"I find that the harder I work, the more luck I seem to have. -Thomas Jefferson",
"The future belongs to those who believe in the beauty of their dreams. -Eleanor Roosevelt",

"The secret of success is to do the common thing uncommonly well. -John D. Rockefeller Jr.",

"I find that the harder I work, the more luck I seem to have. -Thomas Jefferson",

"Success is not final; failure is not fatal: It is the courage to continue that counts. -Winston S. Churchill",

"The way to get started is to quit talking and begin doing. -Walt Disney",

"Don't be distracted by criticism. Remember - the only taste of success some people get is to take a bite out of you. -Zig Ziglar",

"Success usually comes to those who are too busy to be looking for it. -Henry David Thoreau",

"Everything you can imagine is real. -Pablo Picasso",

"If you want to make your dreams come true, the first thing you have to do is wake up. -J.M. Power",

"There are no secrets to success. It is the result of preparation, hard work, and learning from failure. -Colin Powell",

"The real test is not whether you avoid this failure, because you won't. It's whether you let it harden or shame you into inaction, or whether you learn from it; whether you choose to persevere. -Barack Obama",

"The only limit to our realization of tomorrow will be our doubts of today. -Franklin D. Roosevelt",

"It is better to fail in originality than to succeed in imitation. -Herman Melville",

"The future belongs to those who believe in the beauty of their dreams. -Eleanor Roosevelt",

"The road to success and the road to failure are almost exactly the same. -Colin R. Davis",

"Always remember, your focus determines your reality. -George Lucas",

"If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success. -James Cameron",

"If you really look closely, most overnight successes took a long time. -Steve Jobs",

"To be successful, you have to be selfish, or else you never achieve. And once you get to your highest level, then you have to be unselfish. -Michael Jordan",

"Let the future tell the truth, and evaluate each one according to his work and accomplishments. The present is theirs; the future, for which I have really worked, is mine. -Nikola Tesla",

"Try not to become a man of success. Rather become a man of value. -Albert Einstein",

"Don't be afraid to give up the good to go for the great. -John D. Rockefeller",

"Leave nothing for tomorrow which can be done today. -Abraham Lincoln",

"Success is walking from failure to failure with no loss of enthusiasm. -Winston Churchill",

"When you undervalue what you do, the world will undervalue who you are. -Oprah Winfrey",

"If you want to achieve excellence, you can get there today. As of this second, quit doing less-than-excellent work. -Thomas J. Watson",

"If you genuinely want something, don't wait for it - teach yourself to be impatient. -Gurbaksh Chahal",

"The only place where success comes before work is in the dictionary. -Vidal Sassoon",

"If you are not willing to risk the usual, you will have to settle for the ordinary. -Jim Rohn",

"Before anything else, preparation is the key to success. -Alexander Graham Bell",

"In playing ball, and in life, a person occasionally gets the opportunity to do something great. When that time comes, only two things matter: being prepared to seize the moment and having the courage to take your best swing. -Hank Aaron",

"You miss 100% of the shots you don't take. -Wayne Gretzky",
"Whether you think you can or you think you can't, you're right. -Henry Ford",
"I have learned over the years that when one's mind is made up, this diminishes fear. -Rosa Parks",
"I alone cannot change the world, but I can cast a stone across the water to create many ripples. -Mother Teresa",

"Believe you can and you're halfway there. -Theodore Roosevelt",

"The only person you are destined to become is the person you decide to be. -Ralph Waldo Emerson",

"I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel. -Maya Angelou",

"The question isn't who is going to let me; it's who is going to stop me. -Ayn Rand",

"Winning isn't everything, but wanting to win is. -Vince Lombardi",

"Whether you think you can or you think you can't, you're right. -Henry Ford",

"You miss 100% of the shots you don't take. -Wayne Gretzky",

"I alone cannot change the world, but I can cast a stone across the water to create many ripples. -Mother Teresa",

"You become what you believe. -Oprah Winfrey",

"The most difficult thing is the decision to act, the rest is merely tenacity. -Amelia Earhart",

"How wonderful it is that nobody need wait a single moment before starting to improve the world. -Anne Frank",

"An unexamined life is not worth living. -Socrates",

"Everything you've ever wanted is on the other side of fear. -George Addair",

"Dream big and dare to fail. -Norman Vaughan",

"Courage is grace under pressure. -Ernest Hemingway",

"It is still best to be honest and truthful; to make the most of what we have; to be happy with simple pleasures; and have courage when things go wrong.” -Laura Ingalls Wilder",

"Nothing is impossible, the word itself says, 'I'm possible!' -Audrey Hepburn",

"It does not matter how slowly you go as long as you do not stop. -Confucius",

"Don't find fault, find a remedy: anyone can complain. -Henry Ford",

"A man may die, nations may rise and fall, but an idea lives on. -John F. Kennedy",

"I have learned over the years that when one's mind is made up, this diminishes fear. -Rosa Parks",

"I didn't fail the test. I just found 100 ways to do it wrong. -Benjamin Franklin",

"If you're offered a seat on a rocket ship, don't ask what seat! Just get on. -Sheryl Sandberg",

"With great power comes great responsibility. -Stan Lee",

"I would rather die of passion than of boredom. -Vincent van Gogh",

"If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough. -Oprah Winfrey",

"Dreaming, after all, is a form of planning. -Gloria Steinem",

"Whatever the mind of man can conceive and believe, it can achieve. -Napoleon Hill",

"First, have a definite, clear practical ideal; a goal, an objective. Second, have the necessary means to achieve your ends; wisdom, money, materials, and methods. Third, adjust all your means to that end. -Aristotle",

"Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So, throw off the bowlines, sail away from safe harbor, catch the trade winds in your sails. Explore, Dream, Discover. -Mark Twain"
]

export default class ShowCaptchaComponent extends Component {
  @tracked invalidCaptchaMessage = '';

  @tracked enteredCaptchaContent = ''; 
  @tracked isWorking = false;
  @tracked isGettingCaptcha = false;

  captchaSecret = '';
  quoteOfTheDay='';

  constructor() {
    super(...arguments);
    later(
      this,
      function () {
        this.getCaptcha();
      },
      200
    );
    const date = new Date();
    const unixDate =date.getFullYear()*12*31+date.getMonth()*12+date.getDate();
    const quoteIndex = unixDate % _quotes.length;
    this.quoteOfTheDay= _quotes[quoteIndex];
  }

  get isInvalidSolution(){
    return this.invalidCaptchaMessage.length>0;
  }

  @action close() {
    for (const elem of window.document.querySelectorAll(
      '#captcha-container img'
    )) {
      elem.remove();
    }
    this.args.close();
  }

  @action async solveCaptcha() {
    const response = await fetch(
      ENV.captchaApiHost +
        '/api/captcha/verify?captchaSolution=' +
        this.enteredCaptchaContent +
        '&captchaSecret=' +
        encodeURIComponent(this.captchaSecret),
      {
        credentials: 'include',
        method: 'GET',
      }
    );
    if (response.status === 401) {
      this.invalidCaptchaMessage = await response.text();
      await this.getCaptcha();
    }
    if (response.status === 200) {
      alert(this.quoteOfTheDay);
    }
  }

  getCaptcha = async () => {
    
    if(window.document!==undefined)
    {
      this.isGettingCaptcha = true;
      const container = window.document.querySelector('#captcha-container .captcha-image');

      for (const elem of window.document.querySelectorAll(
        '#captcha-container .captcha-image img'
      )) {
        elem.remove();
      }

      await timeout(200);
      const response = await fetch(ENV.captchaApiHost + '/api/captcha/create', {
        method: 'GET',
        credentials: 'include',
      });

      let json = await response.json();
      this.captchaSecret = json.SecretAsBase64;
      const byteCharacters = atob(json.ImageAsBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/bmp' });
      const imageUrl = URL.createObjectURL(blob);

      const image = document.createElement('img');
      image.src = imageUrl;

      container.append(image);

      this.isGettingCaptcha = false;
    }
  };

  @action doNothing(event) {
    event.stopPropagation();
    return false;
  }

  @action updateEnteredCaptchaContent(e) {
    this.invalidCaptchaMessage = '';
    this.enteredCaptchaContent = e.target.value;
  }

 

  @action clearCaptchaContent() {
    this.enteredCaptchaContent = '';
  }

}
