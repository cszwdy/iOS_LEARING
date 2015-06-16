//
//  MMAnimationController.m
//  MMTweenAnimation
//
//  Created by Ralph Li on 4/4/15.
//  Copyright (c) 2015 LJC. All rights reserved.
//

#import "MMAnimationController.h"
#import "MMPaintView.h"
#import "MMTweenAnimation.h"

@interface MMAnimationController ()

@property (nonatomic, strong) MMPaintView *paintView;
@property (nonatomic, strong) UIView *dummy;
@property (nonatomic, strong) UIView *ball;
@property (nonatomic, strong) MMTweenAnimation *anim;

@end

@implementation MMAnimationController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.title = [NSString stringWithFormat:@"%@ - %@",[MMTweenFunction sharedInstance].functionNames[self.functionType],[MMTweenFunction sharedInstance].easingNames[self.easingType]];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    self.paintView = [[MMPaintView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:self.paintView];
    self.paintView.backgroundColor = [UIColor whiteColor];
    
    self.dummy = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 30, 30)];
    self.dummy.layer.cornerRadius = 2.0f;
    self.dummy.backgroundColor = [UIColor darkGrayColor];
    self.dummy.center = CGPointMake(CGRectGetMaxX([UIScreen mainScreen].bounds)-50, 150);
    
    UIView *centerMark = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, 10)];
    [self.dummy addSubview:centerMark];
    centerMark.backgroundColor = [UIColor redColor];
    centerMark.layer.cornerRadius = 5.0f;
    centerMark.center = CGPointMake(15.0f, 15.0f);
    
    [self.paintView addSubview:self.dummy];
    
    self.ball = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, 10)];
    self.ball.layer.cornerRadius = 5.0f;
    self.ball.backgroundColor = [UIColor redColor];
    self.ball.center = CGPointMake(CGRectGetMinX([UIScreen mainScreen].bounds)+50, 150);
    
//    [self.paintView addSubview:self.ball];
    
    [self setupAnimation];
    
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
    [self.view addGestureRecognizer:tap];
}

- (void)tapAction:(UITapGestureRecognizer *)tap {
    
    [self.dummy pop_removeAllAnimations];
    [self.dummy pop_addAnimation:self.anim forKey:@"center"];
    [self setupAnimation];
}

- (void)reset {
    
}

- (void)setupAnimation {
    
    __weak __typeof(&*self)ws = self;
    
    CGFloat YaBegain = self.dummy.center.y;
    CGFloat YBegain = 0;
    CGFloat YEnd = YBegain + 200;
    CGFloat XBegain = 0;
    CGFloat XEnd = XBegain - 0;
    CGFloat rotationBegain = 0;
    CGFloat rotationEnd = 270;
    CGFloat scaleBegain = 1.0;
    CGFloat scaleEnd = 3.0;
    CGFloat alphaBegain = 1.0;
    CGFloat alphaEnd = 0.0;
    self.anim = [[MMTweenAnimation alloc] init];
    self.anim = [MMTweenAnimation animation];
    self.anim.functionType   = self.functionType;
    self.anim.easingType     = self.easingType;
    self.anim.duration       = 2.0f;
    self.anim.fromValue      = @[@(YBegain),
                                 @(XBegain),
                                 @(rotationBegain),
                                 @(scaleBegain),
                                 @(alphaBegain)];
    
    self.anim.toValue        = @[@(YEnd),
                                 @(XEnd),
                                 @(rotationEnd),
                                 @(scaleEnd),
                                 @(alphaEnd)];
    self.anim.animationBlock = ^(double c,double d,NSArray *v,id target,MMTweenAnimation *animation)
    {
        double value = [v[0] doubleValue];
        double xvalue = [v[1] doubleValue];
        double angle = [v[2] doubleValue];
        double scale = [v[3] doubleValue];
        double alpha = [v[4] doubleValue];
//        ws.dummy.center = CGPointMake(xvalue, value);
        ws.dummy.layer.opacity = alpha;
//        ws.dummy.layer.transform = CATransform3DConcat(CATransform3DMakeScale(scale, scale, 0), CATransform3DMakeRotation(angle, 0, 0, 1));
        ws.dummy.layer.transform = CATransform3DConcat(CATransform3DConcat(CATransform3DMakeScale(scale, scale, 0), CATransform3DMakeRotation(angle * M_PI / 180.0, 0, 0, 1)), CATransform3DMakeTranslation(xvalue, value, 0));
//        ws.dummy.layer.transform = CATransform3DMakeTranslation(0, value, 0);
//        ws.ball.center = CGPointMake(50+(CGRectGetWidth([UIScreen mainScreen].bounds)-150)*(c/d), value);
        
        [ws.paintView addDot:ws.ball.center];
    };
    self.anim.completionBlock = ^(POPAnimation *anim, BOOL finished){
        
        if (finished) {
//            ws.dummy.center = CGPointMake(XBegain, YBegain);
            ws.dummy.layer.opacity = alphaBegain;
            ws.dummy.layer.transform = CATransform3DConcat(CATransform3DConcat(CATransform3DMakeScale(scaleBegain, scaleBegain, 0), CATransform3DMakeRotation(rotationBegain, 0, 0, 1)), CATransform3DMakeTranslation(0, 0, 0));
            [ws.dummy pop_removeAllAnimations];
        }
    };
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    [self.paintView clearPaint];
    [self.dummy pop_addAnimation:self.anim forKey:@"center"];
}

- (void)dealloc
{
    [self.dummy pop_removeAllAnimations];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
