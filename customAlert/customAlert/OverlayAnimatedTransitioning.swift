//
//  OverlayAnimatedTransitioning.swift
//  
//
//  Created by Emiaostein on 6/25/15.
//
//

import UIKit

class OverlayAnimatedTransitioning: NSObject, UIViewControllerAnimatedTransitioning {
    
    var dismiss = false
   
    func transitionDuration(transitionContext: UIViewControllerContextTransitioning) -> NSTimeInterval {
        
        return 0.5
    }
    // This method can only  be a nop if the transition is interactive and not a percentDriven interactive transition.
    func animateTransition(transitionContext: UIViewControllerContextTransitioning) {
        
        
        let containerView = transitionContext.containerView()
        let centerX = containerView.center.x
        
        let key = dismiss ? UITransitionContextFromViewControllerKey : UITransitionContextToViewControllerKey
        let targetVC = transitionContext.viewControllerForKey(key)!
        let size = CGSizeMake(320, 240)
        let beginCenter = dismiss ? CGPointMake(centerX, 200) :CGPointMake(centerX, -240)
        let finalCenter = dismiss ? CGPointMake(centerX, -240) :CGPointMake(centerX, 200)
        
        if !dismiss {
            containerView.addSubview(targetVC.view)
        }
        
        targetVC.view.frame.size = size
        targetVC.view.center = beginCenter

        let duration = transitionDuration(transitionContext)
        
        UIView.animateWithDuration(duration, animations: { () -> Void in
            
            targetVC.view.center = finalCenter
            
        }) { (completed) -> Void in
            
            
             transitionContext.completeTransition(completed)
        }
        
       
    }
    
}
